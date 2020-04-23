import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import updateSearchFields from "@insite/client-framework/Store/Pages/InvoiceHistory/Handlers/UpdateSearchFields";
import loadInvoices from "@insite/client-framework/Store/Data/Invoices/Handlers/LoadInvoices";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import Checkbox, { CheckboxProps } from "@insite/mobius/Checkbox";
import Select, { SelectProps } from "@insite/mobius/Select";
import { ShipToCollectionModel } from "@insite/client-framework/Types/ApiModels";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import translate from "@insite/client-framework/Translate";
import { InvoiceHistoryPageContext } from "@insite/content-library/Pages/InvoiceHistoryPage";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Button, { ButtonProps } from "@insite/mobius/Button";
import Tag, { horizontalStyles, TagPresentationProps } from "@insite/mobius/Tag";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";
import { getCurrentShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import loadCurrentShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTos";
import clearSearch from "@insite/client-framework/Store/Pages/InvoiceHistory/Handlers/ClearSearch";

interface State {
    invoiceNumber: string;
    orderNumber: string;
}

const mapStateToProps = (state: ApplicationState) => ({
    filtersOpen: state.pages.invoiceHistory.filtersOpen,
    currentShipTosDataView: getCurrentShipTosDataView(state),
    getInvoicesParameter: state.pages.invoiceHistory.getInvoicesParameter,
});

const mapDispatchToProps = {
    loadCurrentShipTos,
    updateSearchFields,
    loadInvoices,
    clearSearch,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface InvoiceHistoryFilterStyles {
    container?: GridContainerProps;
    heading?: TypographyProps;
    headingItem?: GridItemProps;
    shipToGridItem?: GridItemProps;
    shipToSelect?: SelectProps;
    invoiceNumberGridItem?: GridItemProps;
    invoiceNumberText?: TextFieldProps;
    orderNumberGridItem?: GridItemProps;
    orderNumberText?: TextFieldProps;
    fromGridItem?: GridItemProps;
    fromDate?: DatePickerPresentationProps;
    toGridItem?: GridItemProps;
    toDate?: DatePickerPresentationProps;
    onlyOpenGridItem?: GridItemProps;
    onlyOpenCheckbox?: CheckboxProps;
    appliedFiltersContainer?: InjectableCss;
    appliedFilterTag?: TagPresentationProps;
    buttonsItem?: GridItemProps;
    clearFiltersButton?: ButtonProps;
}

const styles: InvoiceHistoryFilterStyles = {
    container: { css: css` padding-bottom: 15px; ` },
    headingItem: { width: 12, css: css` padding-bottom: 0; ` },
    heading: { variant: "h5", as: "h2", css: css` margin: 0; ` },
    shipToGridItem: { width: [12, 12, 5, 5, 4] },
    invoiceNumberGridItem: { width: [12, 12, 3, 3, 2] },
    orderNumberGridItem: { width: [12, 12, 3, 3, 2] },
    fromGridItem: { width: [6, 6, 3, 2, 2] },
    toGridItem: { width: [6, 6, 3, 3, 2] },
    onlyOpenGridItem: { width: [12, 12, 4, 4, 4], align: "bottom", css: css` padding-top: 0; ` },
    onlyOpenCheckbox: { typographyProps: { css: css` font-weight: 600; ` } },
    appliedFiltersContainer: { css: horizontalStyles },
    buttonsItem: {
        width: 12,
        css: css` justify-content: flex-end; `,
    },
    clearFiltersButton: { variant: "secondary", css: css` margin-right: 10px; ` },
    toDate: { cssOverrides: { formField: css` width: 100%; ` } },
    fromDate: { cssOverrides: { formField: css` width: 100%; ` } },
};

export const filterStyles = styles;
const tzOffset = (new Date()).getTimezoneOffset() * 60000;
class InvoiceHistoryFilter extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            invoiceNumber: this.getValue(props, "invoiceNumber"),
            orderNumber: this.getValue(props, "orderNumber"),
        };
    }

    updateTimeoutId: number | undefined;

    getValue = (props: Props, key: "orderNumber" | "invoiceNumber"): string => {
        let value = props.getInvoicesParameter[key] as string;
        if (!value) {
            value = "";
        }
        return value;
    };

    componentDidMount() {
        if (!this.props.currentShipTosDataView.value) {
            this.props.loadCurrentShipTos();
        }
    }

    componentDidUpdate(prevProps: Props) {
        const previousOrderNumber = this.getValue(prevProps, "orderNumber");
        const currentOrderNumber = this.getValue(this.props, "orderNumber");
        const previousInvoiceNumber = this.getValue(prevProps, "invoiceNumber");
        const currentInvoiceNumber = this.getValue(this.props, "invoiceNumber");

        if ((previousOrderNumber !== currentOrderNumber && currentOrderNumber !== this.state.orderNumber)
            || (previousInvoiceNumber !== currentInvoiceNumber && currentInvoiceNumber !== this.state.invoiceNumber)) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                invoiceNumber: currentInvoiceNumber,
                orderNumber: currentOrderNumber,
            });
        }
    }

    updateParameterAfterTimeout = () => {
        if (typeof this.updateTimeoutId === "number") {
            clearTimeout(this.updateTimeoutId);
        }

        this.updateTimeoutId = setTimeout(() => {
            this.props.updateSearchFields({
                invoiceNumber: this.state.invoiceNumber,
                orderNumber: this.state.orderNumber,
            });
        }, 250);
    };

    shipToChangeHandler = (customerSequence: string) => {
        this.props.updateSearchFields({ customerSequence: customerSequence || "" });
    };

    invoiceNumberChangeHandler = (invoiceNumber: string) => {
        this.setState({
            invoiceNumber,
        });

        this.updateParameterAfterTimeout();
    };

    orderNumberChangeHandler = (orderNumber: string) => {
        this.setState({
            orderNumber,
        });

        this.updateParameterAfterTimeout();
    };

    fromDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({ fromDate: selectedDay ? new Date(selectedDay.getTime() - tzOffset).toISOString().split("T")[0] : "" });
    };

    toDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        this.props.updateSearchFields({ toDate: selectedDay ? new Date(selectedDay.getTime() - tzOffset).toISOString().split("T")[0] : "" });
    };

    showOpenOnlyChangeHandler = (showOpenOnly: boolean) => {
        this.props.updateSearchFields({ showOpenOnly: showOpenOnly || false });
    };

    clearFiltersClickHandler = () => {
        this.props.clearSearch();
    };

    render() {
        if (!this.props.filtersOpen) {
            return <StyledWrapper {...styles.appliedFiltersContainer}>
                {this.props.getInvoicesParameter.customerSequence && this.props.getInvoicesParameter.customerSequence !== "-1"
                    && <Tag {...styles.appliedFilterTag} onDelete={() => { this.shipToChangeHandler("-1"); }}>
                        {`${translate("Ship To")}: ${this.props.getInvoicesParameter.customerSequence}`}
                    </Tag>
                }
                {this.props.getInvoicesParameter.invoiceNumber
                    && <Tag {...styles.appliedFilterTag} onDelete={() => { this.invoiceNumberChangeHandler(""); }}>
                        {`${translate("Invoice #")}: ${this.props.getInvoicesParameter.invoiceNumber}`}
                    </Tag>
                }
                {this.props.getInvoicesParameter.orderNumber
                    && <Tag {...styles.appliedFilterTag} onDelete={() => { this.orderNumberChangeHandler(""); }}>
                        {`${translate("Order #")}: ${this.props.getInvoicesParameter.orderNumber}`}
                    </Tag>
                }
                {this.props.getInvoicesParameter.fromDate
                    && <Tag {...styles.appliedFilterTag} onDelete={() => { this.fromDateChangeHandler({}); }} data-test-selector="invoiceHistory_fromDateButton">
                        {`${translate("From")}: ${this.props.getInvoicesParameter.fromDate}`}
                    </Tag>
                }
                {this.props.getInvoicesParameter.toDate
                    && <Tag {...styles.appliedFilterTag} onDelete={() => { this.toDateChangeHandler({}); }}>
                        {`${translate("To")}: ${this.props.getInvoicesParameter.toDate}`}
                    </Tag>
                }
                {this.props.getInvoicesParameter.showOpenOnly
                    && <Tag {...styles.appliedFilterTag} onDelete={() => { this.showOpenOnlyChangeHandler(false); }}>
                        {translate("Only open")}
                    </Tag>
                }
            </StyledWrapper>;
        }

        const shipToOptions = (this.props.currentShipTosDataView.value) || [];
        const fromDate = this.props.getInvoicesParameter.fromDate ? new Date(new Date(this.props.getInvoicesParameter.fromDate).getTime() + tzOffset) : undefined;
        const toDate = this.props.getInvoicesParameter.toDate ? new Date(new Date(this.props.getInvoicesParameter.toDate).getTime() + tzOffset) : undefined;

        return (
            <GridContainer {...styles.container}>
                <GridItem {...styles.headingItem}>
                    <Typography {...styles.heading}>{translate("Filter")}</Typography>
                </GridItem>
                <GridItem {...styles.shipToGridItem}>
                    <Select
                        {...styles.shipToSelect}
                        label={translate("Ship To")}
                        value={this.props.getInvoicesParameter.customerSequence}
                        onChange={(event) => this.shipToChangeHandler(event.target.value)}>
                        {shipToOptions.map(shipTo =>
                            <option key={shipTo.customerSequence} value={shipTo.customerSequence}>{shipTo.label}</option>,
                        )}
                    </Select>
                </GridItem>
                <GridItem {...styles.invoiceNumberGridItem}>
                    <TextField
                        {...styles.invoiceNumberText}
                        value={this.state.invoiceNumber}
                        label={translate("Invoice #")}
                        onChange={(event) => this.invoiceNumberChangeHandler(event.target.value)}
                        data-test-selector="invoiceHistory_invoiceNumberFilter"
                    />
                </GridItem>
                <GridItem {...styles.orderNumberGridItem}>
                    <TextField
                        {...styles.orderNumberText}
                        value={this.state.orderNumber}
                        label={translate("Order #")}
                        onChange={(event) => this.orderNumberChangeHandler(event.target.value)}
                    />
                </GridItem>
                <GridItem {...styles.fromGridItem} data-test-selector="invoiceHistory_fromDateFilter">
                    <DatePicker
                        {...styles.fromDate}
                        label={translate("From")}
                        selectedDay={fromDate}
                        onDayChange={this.fromDateChangeHandler}
                        dateTimePickerProps={{
                            clearIcon: null,
                            maxDate: toDate,
                            ...styles.fromDate?.dateTimePickerProps,
                        }}
                    />
                </GridItem>
                <GridItem {...styles.toGridItem} data-test-selector="invoiceHistory_toDateFilter">
                    <DatePicker
                        {...styles.toDate}
                        label={translate("To")}
                        selectedDay={toDate}
                        onDayChange={this.toDateChangeHandler}
                        dateTimePickerProps={{
                            clearIcon: null,
                            minDate: fromDate,
                            ...styles.toDate?.dateTimePickerProps,
                        }}
                    />
                </GridItem>
                <GridItem {...styles.onlyOpenGridItem}>
                    <Checkbox
                        {...styles.onlyOpenCheckbox}
                        checked={this.props.getInvoicesParameter.showOpenOnly}
                        onChange={(_, value) => { this.showOpenOnlyChangeHandler(value); }}>
                        {translate("Show only open invoices")}
                    </Checkbox>
                </GridItem>
                <GridItem {...styles.buttonsItem}>
                    <Button
                        {...styles.clearFiltersButton}
                        onClick={this.clearFiltersClickHandler}
                        data-test-selector="invoiceHistory_clearFiltersButton">
                        {translate("Clear Filters")}
                    </Button>
                </GridItem>
            </GridContainer>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(InvoiceHistoryFilter),
    definition: {
        group: "Invoice History",
        displayName: "Search Results Filter",
        allowedContexts: [InvoiceHistoryPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
