import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import * as React from "react";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { css } from "styled-components";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import setErrorsModalIsOpen from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/SetErrorsModalIsOpen";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import { UploadError } from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/BatchLoadProducts";
import cleanupUploadData from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/CleanupUploadData";
import setAllowCancel from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/SetAllowCancel";
import setIsUploading from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/SetIsUploading";
import addCartLineCollectionFromProducts from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/AddCartLineCollectionFromProducts";
import setIsBadFile from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/SetIsBadFile";
import setUploadLimitExceeded from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/SetUploadLimitExceeded";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";

interface OwnProps {
    extendedStyles?: OrderUploadErrorsModalStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    errorsModalIsOpen: state.pages.orderUpload.errorsModalIsOpen,
    products: state.pages.orderUpload.products,
    rowErrors: state.pages.orderUpload.rowErrors,
    isBadFile: state.pages.orderUpload.isBadFile,
    uploadLimitExceeded: state.pages.orderUpload.uploadLimitExceeded,
    cartLink: getPageLinkByPageType(state, "CartPage"),
});

const mapDispatchToProps = {
    setErrorsModalIsOpen,
    cleanupUploadData,
    setAllowCancel,
    setIsUploading,
    setIsBadFile,
    setUploadLimitExceeded,
    addCartLineCollectionFromProducts,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

export interface OrderUploadErrorsModalStyles {
    modal?: ModalPresentationProps;
    errorMessagesModal?: ModalPresentationProps;
    uploadErrorText?: TypographyPresentationProps;
    rowsLimitExceededErrorText?: TypographyPresentationProps;
    continueButton?: ButtonPresentationProps;
    descriptionText?: TypographyPresentationProps;
    dataTable?: DataTableProps;
    tableHead?: DataTableHeadProps;
    rowNumberHeader?: DataTableHeaderProps;
    itemNumberHeader?: DataTableHeaderProps;
    qtyHeader?: DataTableHeaderProps;
    unitOfMeasureHeader?: DataTableHeaderProps;
    reasonHeader?: DataTableHeaderProps;
    tableBody?: DataTableBodyProps;
    tableRow?: DataTableRowProps;
    rowNumberCell?: DataTableCellBaseProps;
    nameCell?: DataTableCellBaseProps;
    qtyCell?: DataTableCellBaseProps;
    umCell?: DataTableCellBaseProps;
    reasonCell?: DataTableCellBaseProps;
    buttonsWrapper?: InjectableCss;
    cancelUploadButton?: ButtonPresentationProps;
    continueAndCheckoutButton?: ButtonPresentationProps;
}

export const orderUploadErrorsModalStyles: OrderUploadErrorsModalStyles = {
    modal: {
        sizeVariant: "medium",
        cssOverrides: {
            modalTitle: css` padding: 10px 20px; `,
            modalContent: css` padding: 20px; `,
        },
    },
    errorMessagesModal: {
        sizeVariant: "small",
        cssOverrides: {
            modalTitle: css` padding: 10px 20px; `,
            modalContent: css` padding: 20px; `,
        },
    },
    uploadErrorText: {
        color: "danger",
        css: css` line-height: 25px; `,
    },
    rowsLimitExceededErrorText: {
        color: "danger",
        css: css` line-height: 25px; `,
    },
    continueButton: {
        variant: "tertiary",
        css: css`
            margin-top: 15px;
            float: right;
        `,
    },
    buttonsWrapper: {
        css: css`
            margin-top: 30px;
            text-align: right;
        `,
    },
    cancelUploadButton: {
        variant: "secondary",
    },
    continueAndCheckoutButton: {
        css: css` margin-left: 10px; `,
    },
};

const OrderUploadErrorsModal: React.FC<Props> = ({
    errorsModalIsOpen,
    products,
    rowErrors,
    isBadFile,
    uploadLimitExceeded,
    cartLink,
    history,
    setErrorsModalIsOpen,
    cleanupUploadData,
    setAllowCancel,
    setIsUploading,
    addCartLineCollectionFromProducts,
    setIsBadFile,
    setUploadLimitExceeded,
    extendedStyles,
}) => {
    const [styles] = React.useState(() => mergeToNew(orderUploadErrorsModalStyles, extendedStyles));

    const toasterContext = React.useContext(ToasterContext);

    const closeModal = () => {
        setErrorsModalIsOpen({ errorsModalIsOpen: false });
    };

    const modalOnAfterCloseHandler = () => {
        setIsBadFile({ isBadFile: false });
        setUploadLimitExceeded({ uploadLimitExceeded: false });
    };

    const cancelUploadHandler = () => {
        setErrorsModalIsOpen({ errorsModalIsOpen: false });
        cleanupUploadData();
    };

    const uploadProducts = () => {
        setErrorsModalIsOpen({ errorsModalIsOpen: false });
        setAllowCancel({ allowCancel: false });
        addCartLineCollectionFromProducts({
            products,
            onSuccess: onUploadingSuccess,
        });
    };

    const onUploadingSuccess = React.useCallback(
        () => {
            setIsUploading({ isUploading: false });
            cleanupUploadData();
            toasterContext.addToast({ body: `${products.length} ${translate("items uploaded")}`, messageType: "success" });
            cartLink && history.push(cartLink.url);
        },
        [products],
    );

    return <Modal
        {...(isBadFile || uploadLimitExceeded ? styles.errorMessagesModal : styles.modal)}
        headline={translate("Upload Error")}
        isOpen={errorsModalIsOpen}
        handleClose={closeModal}
        onAfterClose={modalOnAfterCloseHandler}
    >
        {isBadFile || uploadLimitExceeded
            ? <>
                {isBadFile
                    && <Typography as="p" {...styles.uploadErrorText}>{siteMessage("OrderUpload_UploadError")}</Typography>
                }
                {uploadLimitExceeded
                    && <Typography as="p" {...styles.rowsLimitExceededErrorText}>{siteMessage("OrderUpload_RowsLimitExceeded")}</Typography>
                }
                <Button {...styles.continueButton} onClick={closeModal}>{translate("Continue")}</Button>
            </>
            : <>
                <Typography {...styles.descriptionText}>{siteMessage("QuickOrder_OrderUpload_AddToCartError")}</Typography>
                <DataTable {...styles.dataTable}>
                    <DataTableHead {...styles.tableHead}>
                        <DataTableHeader {...styles.rowNumberHeader}>{translate("Row")}</DataTableHeader>
                        <DataTableHeader {...styles.itemNumberHeader}>{translate("Item #")}</DataTableHeader>
                        <DataTableHeader {...styles.qtyHeader}>{translate("QTY")}</DataTableHeader>
                        <DataTableHeader {...styles.unitOfMeasureHeader}>{translate("U/M")}</DataTableHeader>
                        <DataTableHeader {...styles.reasonHeader}>{translate("Reason")}</DataTableHeader>
                    </DataTableHead>
                    <DataTableBody {...styles.tableBody}>
                        {rowErrors.map(({ index, name, qtyRequested, umRequested, error }) => (
                            <DataTableRow key={index} {...styles.tableRow}>
                                <DataTableCell {...styles.rowNumberCell}>{index}</DataTableCell>
                                <DataTableCell {...styles.nameCell}>{name}</DataTableCell>
                                <DataTableCell {...styles.qtyCell}>{qtyRequested}</DataTableCell>
                                <DataTableCell {...styles.umCell}>{umRequested}</DataTableCell>
                                <DataTableCell {...styles.reasonCell}>
                                    {error === UploadError.NotEnough && siteMessage("QuickOrder_NotEnoughQuantity")}
                                    {error === UploadError.ConfigurableProduct && siteMessage("QuickOrder_CannotOrderConfigurable")}
                                    {error === UploadError.StyledProduct && siteMessage("QuickOrder_CannotOrderStyled")}
                                    {error === UploadError.Unavailable && siteMessage("QuickOrder_ProductIsUnavailable")}
                                    {error === UploadError.InvalidUnit && siteMessage("Invalid U/M")}
                                    {error === UploadError.NotFound && siteMessage("Product_NotFound")}
                                    {error === UploadError.OutOfStock && siteMessage("Out of stock")}
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
                <StyledWrapper {...styles.buttonsWrapper}>
                    <Button {...styles.cancelUploadButton} onClick={cancelUploadHandler}>{translate("Cancel Upload")}</Button>
                    <Button
                        {...styles.continueAndCheckoutButton}
                        onClick={uploadProducts}
                        disabled={!products || products.length === 0}
                    >
                        {translate("Continue and Checkout")}
                    </Button>
                </StyledWrapper>
            </>
        }
    </Modal>;
};

export default connect(mapStateToProps, mapDispatchToProps)(withHistory(OrderUploadErrorsModal));
