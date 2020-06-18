import React, { FC, useState, useContext, useRef } from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import translate from "@insite/client-framework/Translate";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import siteMessage from "@insite/client-framework/SiteMessage";
import FileUpload, { FileUploadPresentationProps } from "@insite/mobius/FileUpload";
import Checkbox, { CheckboxProps } from "@insite/mobius/Checkbox";
import { OrderUploadPageContext } from "@insite/content-library/Pages/OrderUploadPage";
import batchLoadProducts from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/BatchLoadProducts";
import processFile from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/ProcessFile";
import addCartLineCollectionFromProducts from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/AddCartLineCollectionFromProducts";
import cleanupUploadData from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/CleanupUploadData";
import setAllowCancel from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/SetAllowCancel";
import setIsBadFile from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/SetIsBadFile";
import setIsUploading from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/SetIsUploading";
import setUploadCancelled from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/SetUploadCancelled";
import setUploadLimitExceeded from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/SetUploadLimitExceeded";
import setErrorsModalIsOpen from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/SetErrorsModalIsOpen";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";

const mapStateToProps = (state: ApplicationState) => ({
    uploadedItems: state.pages.orderUpload.uploadedItems,
    isUploading: state.pages.orderUpload.isUploading,
    products: state.pages.orderUpload.products,
    rowErrors: state.pages.orderUpload.rowErrors,
    isBadFile: state.pages.orderUpload.isBadFile,
    productsProcessed: state.pages.orderUpload.productsProcessed,
    allowCancel: state.pages.orderUpload.allowCancel,
    uploadCancelled: state.pages.orderUpload.uploadCancelled,
    uploadLimitExceeded: state.pages.orderUpload.uploadLimitExceeded,
});

const mapDispatchToProps = {
    processFile,
    addCartLineCollectionFromProducts,
    batchLoadProducts,
    cleanupUploadData,
    setAllowCancel,
    setIsBadFile,
    setIsUploading,
    setUploadCancelled,
    setUploadLimitExceeded,
    setErrorsModalIsOpen,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderUploadFileUploadStyles {
    uploadLinkTooltipText?: TypographyPresentationProps;
    downloadTemplateButton?: ButtonPresentationProps;
    fileUploader?: FileUploadPresentationProps;
    includeFirstRowCheckbox?: CheckboxProps;
    cancelUploadButton?: ButtonPresentationProps;
    uploadFileButton?: ButtonPresentationProps;
    spinner?: LoadingSpinnerProps;
    uploadingButtonLabel?: TypographyPresentationProps;
    uploadFileButtonLabel?: TypographyPresentationProps;
}

const styles: OrderUploadFileUploadStyles = {
    uploadLinkTooltipText: {
        css: css` margin-bottom: 15px; `,
    },
    downloadTemplateButton: {
        css: css` margin-bottom: 15px; `,
        variant: "tertiary",
    },
    includeFirstRowCheckbox: {
        css: css`
            margin: 15px 0;
            display: block;
        `,
    },
    fileUploader: {
        buttonProps: {
            variant: "tertiary",
        },
    },
    cancelUploadButton: {
        variant: "secondary",
        css: css` float: right; `,
    },
    uploadFileButton: {
        css: css`
            float: right;
            margin-left: 15px;
        `,
    },
    spinner: {
        size: 22,
        css: css` margin-right: 8px; `,
    },
    uploadingButtonLabel: {
        css: css`
            font-size: 15px;
            font-weight: bold;
            vertical-align: super;
        `,
    },
    uploadFileButtonLabel: {
        css: css`
            font-size: 15px;
            font-weight: bold;
        `,
    },
};

export const orderUploadFileUploadStyles = styles;

const OrderUploadFileUpload: FC<Props> = ({
    uploadedItems,
    isUploading,
    products,
    rowErrors,
    isBadFile,
    productsProcessed,
    allowCancel,
    uploadCancelled,
    uploadLimitExceeded,
    processFile,
    addCartLineCollectionFromProducts,
    batchLoadProducts,
    cleanupUploadData,
    setAllowCancel,
    setIsBadFile,
    setIsUploading,
    setUploadCancelled,
    setErrorsModalIsOpen,
}) => {
    const toasterContext = useContext(ToasterContext);
    const fileUploadRef = useRef({ value: "" } as HTMLInputElement);

    const [file, setFile] = useState<any>(null);
    const [incorrectFileExtension, setIncorrectFileExtension] = React.useState(false);
    const [firstRowHeading, setFirstRowHeading] = React.useState(true);
    const firstRowHeadingChangeHandler: CheckboxProps["onChange"] = (_, value) => { setFirstRowHeading(value); };

    React.useEffect(
        () => batchGetProducts(),
        [uploadedItems],
    );

    React.useEffect(
        () => checkCompletion(),
        [productsProcessed],
    );

    React.useEffect(
        () => {
            if (isBadFile || uploadLimitExceeded) {
                setErrorsModalIsOpen({ errorsModalIsOpen: true });
            }
        },
        [isBadFile, uploadLimitExceeded],
    );

    const downloadTemplateHandler = () => {
        window.open(`${window.location.origin}/Excel/OrderUploadTemplate.xlsx`);
    };

    const cancelUploadingHandler = () => {
        setUploadCancelled({ uploadCancelled: true });
        setIsUploading({ isUploading: false });
        cleanupUploadData();
        setFile(null);
        if (fileUploadRef.current?.value) fileUploadRef.current.value = "";
        setFirstRowHeading(false);
    };

    const uploadFileHandler = () => {
        if (isUploading) {
            return;
        }

        setUploadCancelled({ uploadCancelled: false });
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = onReaderLoad(getFileExtension(file.name));
        reader.readAsArrayBuffer(file);
    };

    const onReaderLoad = (fileExtension: string) => {
        return (e: Event) => {
            const data = (e.target as any).result;
            processFile({ data, fileExtension, firstRowHeading });
        };
    };

    const batchGetProducts = () => {
        cleanupUploadData();
        if (!file) {
            return;
        }

        if (uploadedItems.length === 0) {
            setIsBadFile({ isBadFile: true });
            return;
        }

        const extendedNames = uploadedItems.map(item => item.name);
        batchLoadProducts({ extendedNames, firstRowHeading });
    };

    const checkCompletion = React.useCallback(
        () => {
            if (!productsProcessed || uploadCancelled) {
                return;
            }

            if (uploadedItems.length === products.length && rowErrors.length === 0) {
                uploadProducts();
            } else {
                setIsUploading({ isUploading: false });
                setErrorsModalIsOpen({ errorsModalIsOpen: true });
            }
        },
        [productsProcessed, uploadCancelled, uploadedItems, products, rowErrors],
    );

    const uploadProducts = () => {
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
        },
        [products],
    );

    const getFileExtension = (fileName: string) => {
        const splitFileName = fileName.split(".");
        return splitFileName.length > 0 ? splitFileName[splitFileName.length - 1].toLowerCase() : "";
    };

    const fileChangeHandler = (event: React.ChangeEvent<any>) => {
        const uploadedFile = event.target.files[0];
        setFile(uploadedFile);
        if (uploadedFile) {
            const fileExtension = getFileExtension(uploadedFile.name);
            const incorrectFileExtension = ["xls", "xlsx", "csv"].indexOf(fileExtension) === -1;
            setIncorrectFileExtension(incorrectFileExtension);
            setIsBadFile({ isBadFile: incorrectFileExtension });
            setUploadLimitExceeded({ uploadLimitExceeded: false });
        }
    };

    return (
        <>
            <Typography as="p" {...styles.uploadLinkTooltipText}>{siteMessage("Lists_UploadLinkTooltip")}</Typography>
            <Button {...styles.downloadTemplateButton} onClick={downloadTemplateHandler}>{translate("Download Template")}</Button>
            <FileUpload
                {...styles.fileUploader}
                inputRef={fileUploadRef}
                fileName={file?.name || ""}
                accept=".xls,.xlsx,.csv"
                label={translate("Upload a File")}
                labelPosition="top"
                error={incorrectFileExtension ? translate("must be .xls, .xlsx or .csv") : undefined}
                onFileChange={fileChangeHandler}
                uid="orderUploadFileUpload"
            />
            <Checkbox {...styles.includeFirstRowCheckbox} onChange={firstRowHeadingChangeHandler} checked={firstRowHeading} uid="includeHeading">
                {translate("Include First Row Column Heading")}
            </Checkbox>
            <Button {...styles.uploadFileButton} disabled={!file || isUploading} onClick={uploadFileHandler}>
                {isUploading
                    && <>
                        <LoadingSpinner {...styles.spinner} />
                        <Typography {...styles.uploadingButtonLabel}>{translate("Uploading")}</Typography>
                    </>}
                {!isUploading
                    && <Typography {...styles.uploadFileButtonLabel}>{translate("Upload File")}</Typography>}
            </Button>
            <Button {...styles.cancelUploadButton} onClick={cancelUploadingHandler} disabled={!isUploading || !allowCancel || uploadCancelled}>
                {translate("Cancel Upload")}
            </Button>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderUploadFileUpload),
    definition: {
        group: "Order Upload",
        allowedContexts: [OrderUploadPageContext],
        isSystem: true,
    },
};

export default widgetModule;
