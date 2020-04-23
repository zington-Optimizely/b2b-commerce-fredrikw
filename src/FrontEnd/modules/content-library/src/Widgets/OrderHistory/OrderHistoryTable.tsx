import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import reorder from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/Reorder";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import OrderDetailPageTypeLink from "@insite/content-library/Components/OrderDetailPageTypeLink";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import ChevronDown from "@insite/mobius/Icons/ChevronDown";
import ChevronUp from "@insite/mobius/Icons/ChevronUp";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";
import { LinkPresentationProps } from "@insite/mobius/Link";
import { OrdersDataViewContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";

const enum fields {
    showReorderProducts = "showReorderProducts",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.showReorderProducts]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        parameter: state.pages.orderHistory.getOrdersParameter,
        isReordering: state.pages.orderHistory.isReordering,
        showAddToCartConfirmationDialog: getSettingsCollection(state).productSettings.showAddToCartConfirmationDialog,
        language: state.context.session.language,
    };
};

const mapDispatchToProps = {
    updateSearchFields,
    reorder,
};

type Props = ReturnType<typeof mapStateToProps> & OwnProps & ResolveThunks<typeof mapDispatchToProps> & HasToasterContext;

export interface OrderHistoryTableStyles {
    container?: InjectableCss;
    headerClickable?: ClickableProps;
    headerText?: TypographyProps;
    sortAscendingIcon?: IconPresentationProps;
    sortDescendingIcon?: IconPresentationProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyProps;
    orderDateHeader?: DataTableHeaderProps;
    orderNumberHeader?: DataTableHeaderProps;
    shipToHeader?: DataTableHeaderProps;
    statusHeader?: DataTableHeaderProps;
    customerPOHeader?: DataTableHeaderProps;
    orderTotalHeader?: DataTableHeaderProps;
    reorderHeader?: DataTableHeaderProps;
    orderDateCells?: DataTableCellProps;
    orderNumberCells?: DataTableCellProps;
    shipToCells?: DataTableCellProps;
    statusCells?: DataTableCellProps;
    customerPOCells?: DataTableCellProps;
    orderTotalCells?: DataTableCellProps;
    reorderCells?: DataTableCellProps;
    reorderButton?: ButtonPresentationProps;
    reorderButtonSpinner?: LoadingSpinnerProps;
    orderNumberLink?: LinkPresentationProps;
    dataTable?: DataTableProps;
}

const styles: OrderHistoryTableStyles = {
    container: {
        css: css` overflow: auto; `,
    },
    sortAscendingIcon: {
        src: ChevronUp,
        size: 14,
    },
    sortDescendingIcon: {
        src: ChevronDown,
        size: 14,
    },
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css` margin: auto; `,
    },
    noResultsContainer: {
        css: css`
            text-align: center;
            padding: 20px;
        `,
    },
    noResultsText: {
        variant: "h4",
    },
    headerClickable: {
        css: css`
            width: 100%;
            justify-content: space-between;
        `,
    },
    reorderButton: {
        color: "secondary",
        sizeVariant: "medium",
    },
    reorderButtonSpinner: {
        size: 22,
        css: css`
            margin-left: auto;
            margin-right: auto;
            display: block;
        `,
    },
    shipToHeader: {
        tight: true,
    },
    orderTotalHeader: {
        tight: true,
        alignX: "right",
    },
    reorderHeader: {
        tight: true,
    },
    orderTotalCells: {
        alignX: "right",
    },
    shipToCells: {
        typographyProps: {
            ellipsis: true,
            css: css`
                display: block;
                max-width: 300px;
            `,
        },
    },
};

export const orderHistoryTableStyles = styles;

class OrderHistoryTable extends React.Component<Props> {

    static contextType = OrdersDataViewContext;
    context!: React.ContextType<typeof OrdersDataViewContext>;

    headerClick(sortField: string) {
        const sort = this.props.parameter.sort === sortField ? `${sortField} DESC` : sortField;
        this.props.updateSearchFields({ sort });
    }

    sortingHeaderLabel = (label: string, sortField: string) =>
        <Clickable {...styles.headerClickable}
            onClick={() => this.headerClick(sortField)}>
            <Typography {...styles.headerText}>{translate(label)}</Typography>
            {this.props.parameter.sort === sortField
                ? <Icon {...styles.sortAscendingIcon}/>
                : this.props.parameter.sort === `${sortField} DESC`
                    ? <Icon {...styles.sortDescendingIcon}/> : null}
        </Clickable>;

    onReorderSuccess = (orderNumber: string, linkOrderNumber: string) => {
        if (!this.props.showAddToCartConfirmationDialog) {
            return;
        }
        this.props.toaster.addToast({
            children: <><OrderDetailPageTypeLink title={orderNumber} orderNumber={linkOrderNumber} />&nbsp;{translate("added to cart")}</>,
            messageType: "success",
            timeoutLength: 6000,
        });
    };

    render() {
        const ordersDataView = this.context;
        if (ordersDataView.isLoading) {
            return (
                <StyledWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.spinner} />
                </StyledWrapper>
            );
        }

        if (!ordersDataView.value) {
            return null;
        }

        if (ordersDataView.value.length === 0) {
            return  <StyledWrapper {...styles.noResultsContainer}>
                <Typography as="p" {...styles.noResultsText}>{translate("No orders found")}</Typography>
            </StyledWrapper>;
        }

        const rows = ordersDataView.value.map(order => {
            return {
                id: order.id,
                linkOrderNumber: order.webOrderNumber || order.erpOrderNumber,
                date: order.orderDate ? getLocalizedDateTime({
                    dateTime: new Date(order.orderDate),
                    language: this.props.language,
                }) : "",
                orderNumber: order.webOrderNumber || order.erpOrderNumber,
                shipTo: `${order.stCompanyName} ${order.btAddress1} ${order.btAddress2} ${order.shipToCity} ${order.shipToState}`,
                status: order.statusDisplay,
                po: order.customerPO,
                total: order.orderGrandTotalDisplay,
            };
        });

        return (
            <StyledWrapper {...styles.container} data-test-selector="orderHistoryTable">
                <DataTable {...styles.dataTable}>
                    <DataTableHead>
                        <DataTableHeader {...styles.orderNumberHeader} title={translate("Order Number")}>
                            {this.sortingHeaderLabel("Order #", "webOrderNumber")}
                        </DataTableHeader>
                        <DataTableHeader {...styles.orderDateHeader}>
                            {this.sortingHeaderLabel("Date", "orderDate")}
                        </DataTableHeader>
                        <DataTableHeader {...styles.orderTotalHeader}>
                            {this.sortingHeaderLabel("Order Total", "orderTotal")}
                        </DataTableHeader>
                        <DataTableHeader {...styles.statusHeader}>
                            {this.sortingHeaderLabel("Status", "status")}
                        </DataTableHeader>
                        <DataTableHeader {...styles.shipToHeader}>
                            {this.sortingHeaderLabel("Ship To / Pick Up", "stCompanyName")}
                        </DataTableHeader>
                        <DataTableHeader {...styles.customerPOHeader} title={translate("Purchase Order Number")}>
                            {this.sortingHeaderLabel("PO #", "customerPO")}
                        </DataTableHeader>
                        {this.props.fields.showReorderProducts
                            && <DataTableHeader {...styles.reorderHeader} title={translate("reorder")} />
                        }
                    </DataTableHead>
                    <DataTableBody data-test-selector="orderHistoryTable_tableBody">
                        {rows.map(({ id, linkOrderNumber, date, orderNumber, shipTo, status, po, total }) => (
                            <DataTableRow key={id}>
                                <DataTableCell {...styles.orderNumberCells} data-test-selector="orderHistoryTable_tableCell_orderNumber">
                                    <OrderDetailPageTypeLink title={orderNumber} orderNumber={linkOrderNumber} />
                                </DataTableCell>
                                <DataTableCell {...styles.orderDateCells} data-test-selector="orderHistoryTable_tableCell_date">{date}</DataTableCell>
                                <DataTableCell {...styles.orderTotalCells}>{total}</DataTableCell>
                                <DataTableCell {...styles.statusCells} data-test-selector="orderHistoryTable_tableCell_status">{status}</DataTableCell>
                                <DataTableCell {...styles.shipToCells}>{shipTo}</DataTableCell>
                                <DataTableCell {...styles.customerPOCells}>{po}</DataTableCell>
                                {this.props.fields.showReorderProducts
                                    && <DataTableCell {...styles.reorderCells}>
                                        {this.props.isReordering[orderNumber]
                                            && <LoadingSpinner {...styles.reorderButtonSpinner} />
                                        }
                                        {!this.props.isReordering[orderNumber]
                                            && <Button {...styles.reorderButton}
                                                onClick={() => this.props.reorder({ orderNumber, onSuccess: () => this.onReorderSuccess(orderNumber, linkOrderNumber) })}>
                                                {translate("Reorder")}
                                            </Button>
                                        }

                                    </DataTableCell>
                                }
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            </StyledWrapper>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(OrderHistoryTable)),
    definition: {
        group: "Order History",
        displayName: "Search Results Table",
        allowedContexts: [OrderHistoryPageContext],
        fieldDefinitions: [
            {
                name: fields.showReorderProducts,
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
            },
        ],
    },
};

export default widgetModule;
