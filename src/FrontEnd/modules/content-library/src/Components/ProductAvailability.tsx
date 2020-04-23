import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React, { FC } from "react";
import {
    AvailabilityDto,
    AvailabilityMessageType,
    ProductSettingsModel, WarehouseDto,
} from "@insite/client-framework/Types/ApiModels";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import translate from "@insite/client-framework/Translate";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import styled, { css } from "styled-components";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import wrapInContainerStyles from "@insite/client-framework/Common/wrapInContainerStyles";
import AlertTriangle from "@insite/mobius/Icons/AlertTriangle";
import X from "@insite/mobius/Icons/X";
import Check from "@insite/mobius/Icons/Check";
import Icon, { IconWrapper } from "@insite/mobius/Icon";
import safeColor from "@insite/mobius/utilities/safeColor";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import getRealTimeWarehouseInventory from "@insite/client-framework/Store/Data/RealTimeInventory/Handlers/GetRealTimeWarehouseInventory";

interface OwnProps {
    productId: string;
    availability?: AvailabilityDto;
    unitOfMeasure: string;
    trackInventory: boolean;
    isProductDetailsPage?: boolean;
    extendedStyles?: ProductAvailabilityStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

const mapDispatchToProps = {
    getRealTimeWarehouseInventory,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ProductAvailabilityStyles {
    container?: GridContainerProps;
    messageGridItem?: GridItemProps;
    availabilityByWarehouseLinkGridItem?: GridItemProps;
    inventoryMessage?: InjectableCss;
    messageText?: TypographyPresentationProps;
    realTimeText?: TypographyPresentationProps;
    errorText?: TypographyPresentationProps;
    availabilityByWarehouseLink?: LinkPresentationProps;
    availabilityByWarehouseModal?: ModalPresentationProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    availabilityByWarehouseTable?: DataTableProps;
    availabilityByWarehouseTableHead?: DataTableHeadProps;
    availabilityByWarehouseTableHeader?: DataTableHeaderProps;
    availabilityByWarehouseTableBody?: DataTableBodyProps;
    availabilityByWarehouseTableRow?: DataTableRowProps;
    availabilityByWarehouseTableCell?: DataTableCellBaseProps;
}

export const productAvailabilityStyles: ProductAvailabilityStyles = {
    container: { gap: 0 },
    messageGridItem: { width: 12 },
    availabilityByWarehouseLinkGridItem: { width: 12 },
    availabilityByWarehouseModal: {
        size: 400,
        cssOverrides: {
            modalContent: css` padding: 0; `,
            modalTitle: css` padding: 10px 10px 10px 20px; `,
            headlineTypography: css`
                font-size: 20px;
                margin-bottom: 0;
            `,
        },
    },
    centeringWrapper: {
        css: css`
            height: 100px;
            width: 100%;
            display: flex;
            align-items: center;
        `,
    },
    spinner: { css: css` margin: 0 auto; ` },
    messageText: {
        css: css`
            width: 100%;
            ${wrapInContainerStyles}
        `,
    },
    realTimeText: {
        weight: "bold",
        css: css`
                display: inline-block;
                text-align: left;
                min-width: 25px;

                &::after {
                    overflow: hidden;
                    display: inline-block;
                    vertical-align: bottom;
                    animation: ellipsis steps(4, end) 900ms infinite 1s;
                    content: "\\2026";
                    width: 0;
                }

                @keyframes ellipsis {
                    to {
                        width: 1.25em;
                    }
                }
            `,
    },
    errorText: {
        css: css`
            width: 100%;
            word-wrap: break-word;
        `,
    },
};

const InventoryMessage = styled.div<{ color: string; }>`
    display: flex;
    align-items: center;
    padding: 5px;
    border-radius: 5px;
    background-color: ${props => safeColor(resolveColor(props.color, props.theme)).rgb().alpha(0.2).string()};
    ${IconWrapper} {
        margin-right: 10px;
    }
`;
// /* background-color: ; */

const getAvailabilityColor = (availability?: AvailabilityDto) => {
    let color = "success";
    if (!availability) {
        return color;
    }

    const availabilityType = availability.messageType;
    if (availabilityType === AvailabilityMessageType.OutOfStock) {
        color = "danger";
    } else if (availabilityType === AvailabilityMessageType.LowStock) {
        color = "warning";
    }
    return color;
};

const getAvailabilityIcon = (availability?: AvailabilityDto) => {
    let iconSrc = Check;
    if (!availability) {
        return iconSrc;
    }

    const availabilityType = availability.messageType;
    if (availabilityType === AvailabilityMessageType.OutOfStock) {
        iconSrc = X;
    } else if (availabilityType === AvailabilityMessageType.LowStock) {
        iconSrc = AlertTriangle;
    }
    return iconSrc;
};

const showLink = (trackInventory: boolean, productSettings: ProductSettingsModel, isProductDetailsPage?: boolean): boolean => {
    if (!trackInventory || !productSettings.showInventoryAvailability || !productSettings.displayInventoryPerWarehouse) {
        return false;
    }

    if (!productSettings.displayInventoryPerWarehouseOnlyOnProductDetail) {
        return true;
    }

    return !!isProductDetailsPage;
};

const ProductAvailability: FC<Props> = ({
                                            productId,
                                            availability,
                                            unitOfMeasure,
                                            trackInventory,
                                            productSettings,
                                            isProductDetailsPage,
                                            getRealTimeWarehouseInventory,
                                            extendedStyles,
                                        }) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [warehouses, setWarehouses] = React.useState<WarehouseDto[] | undefined>(undefined);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const modalCloseHandler = () => {
        setModalIsOpen(false);
    };
    const viewAvailabilityByWarehouseClickHandler = () => {
        setIsLoading(true);
        setModalIsOpen(true);
        getRealTimeWarehouseInventory({
            productId, unitOfMeasure, expand: ["warehouses"], onComplete: (result) => {
                setWarehouses(result.warehouses);
                setErrorMessage(result.errorMessage);
                setIsLoading(false);
            },
        });

    };

    const color = getAvailabilityColor(availability);
    const iconSrc = getAvailabilityIcon(availability);

    const [styles] = React.useState(() => mergeToNew(productAvailabilityStyles, extendedStyles));

    let inventoryTextComponent = <Typography {...styles.realTimeText}/>;
    if (availability && availability.message) {
        inventoryTextComponent = <InventoryMessage color={color} {...styles.inventoryMessage}>
            <Icon color={color} src={iconSrc}/>
            <Typography {...styles.messageText} data-test-selector="availabilityMessage">
                {availability.message}
            </Typography>
        </InventoryMessage>;
    } else if (availability) {
        inventoryTextComponent = <></>;
    }

    return (<GridContainer {...styles.container}>
        <GridItem  {...styles.messageGridItem}>
            {inventoryTextComponent}
        </GridItem>
        {showLink(trackInventory, productSettings, isProductDetailsPage)
        && <GridItem {...styles.availabilityByWarehouseLinkGridItem}>
            <Link
                {...styles.availabilityByWarehouseLink}
                onClick={viewAvailabilityByWarehouseClickHandler}
                data-test-selector="availabilityByWarehouseLink"
            >
                {translate("View Availability by Warehouse")}
            </Link>
            <Modal
                {...styles.availabilityByWarehouseModal}
                headline={translate("Warehouse Inventory")}
                isOpen={modalIsOpen}
                handleClose={modalCloseHandler}
            >
                {isLoading
                && <StyledWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.spinner} />
                </StyledWrapper>
                }
                {!isLoading
                && <>
                    {errorMessage
                        ? <div>{errorMessage}</div>
                        : <DataTable {...styles.availabilityByWarehouseTable} data-test-selector="availabilityByWarehouseModal">
                            <DataTableHead {...styles.availabilityByWarehouseTableHead}>
                                <DataTableHeader {...styles.availabilityByWarehouseTableHeader}>{translate("Warehouse")}</DataTableHeader>
                                <DataTableHeader {...styles.availabilityByWarehouseTableHeader}>{translate("Qty")}</DataTableHeader>
                            </DataTableHead>
                            <DataTableBody {...styles.availabilityByWarehouseTableBody}>
                                {warehouses?.map(warehouse =>
                                    <DataTableRow {...styles.availabilityByWarehouseTableRow} key={warehouse.name}>
                                        <DataTableCell {...styles.availabilityByWarehouseTableCell}>{warehouse.description || warehouse.name}</DataTableCell>
                                        <DataTableCell {...styles.availabilityByWarehouseTableCell}>{warehouse.qty}</DataTableCell>
                                    </DataTableRow>)
                                }
                            </DataTableBody>
                        </DataTable>
                    }
                </>
                }
            </Modal>
        </GridItem>
        }
    </GridContainer>);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductAvailability);
