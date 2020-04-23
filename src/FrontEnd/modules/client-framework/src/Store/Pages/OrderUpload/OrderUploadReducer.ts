import { Draft } from "immer";
import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import OrderUploadState from "@insite/client-framework/Store/Pages/OrderUpload/OrderUploadState";
import { CartLineCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { ProcessFileResult } from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/ProcessFile";
import { BatchLoadProductsResult } from "@insite/client-framework/Store/Pages/OrderUpload/Handlers/BatchLoadProducts";

const initialState: OrderUploadState = {
    uploadedItems: [],
    products: [],
    rowErrors: [],
    isBadFile: false,
    isUploading: false,
    productsProcessed: false,
    allowCancel: false,
    uploadCancelled: false,
    uploadLimitExceeded: false,
    errorsModalIsOpen: false,
};

const reducer = {
    "Pages/OrderUpload/BeginAddCartLineCollectionFromProducts": (draft: Draft<OrderUploadState>) => {
    },
    "Pages/OrderUpload/CompleteAddCartLineCollectionFromProducts": (draft: Draft<OrderUploadState>, action: { result: CartLineCollectionModel; }) => {
        draft.productsProcessed = false;
    },
    "Pages/OrderUpload/BeginBatchLoadProducts": (draft: Draft<OrderUploadState>) => {
        draft.productsProcessed = false;
    },
    "Pages/OrderUpload/CompleteBatchLoadProducts": (draft: Draft<OrderUploadState>, action: { result: BatchLoadProductsResult }) => {
        draft.products = action.result.products;
        draft.rowErrors = action.result.rowErrors;
        draft.productsProcessed = true;
    },
    "Pages/OrderUpload/CleanupUploadData": (draft: Draft<OrderUploadState>) => {
        draft.products = [];
        draft.rowErrors = [];
    },
    "Pages/OrderUpload/BeginProcessFile": (draft: Draft<OrderUploadState>) => {
    },
    "Pages/OrderUpload/CompleteProcessFile": (draft: Draft<OrderUploadState>, action: { result: ProcessFileResult; }) => {
        draft.uploadedItems = action.result.uploadedItems;
        draft.uploadLimitExceeded = action.result.uploadLimitExceeded;
        draft.isBadFile = action.result.isBadFile;
        draft.isUploading = action.result.isUploading;
        draft.allowCancel = action.result.allowCancel;
    },
    "Pages/OrderUpload/SetAllowCancel": (draft: Draft<OrderUploadState>, action: { parameter: { allowCancel: boolean } }) => {
        draft.allowCancel = action.parameter.allowCancel;
    },
    "Pages/OrderUpload/SetErrorsModalIsOpen": (draft: Draft<OrderUploadState>, action: { parameter: { errorsModalIsOpen: boolean } }) => {
        draft.errorsModalIsOpen = action.parameter.errorsModalIsOpen;
    },
    "Pages/OrderUpload/SetIsBadFile": (draft: Draft<OrderUploadState>, action: { parameter: { isBadFile: boolean } }) => {
        draft.isBadFile = action.parameter.isBadFile;
    },
    "Pages/OrderUpload/SetIsUploading": (draft: Draft<OrderUploadState>, action: { parameter: { isUploading: boolean } }) => {
        draft.isUploading = action.parameter.isUploading;
    },
    "Pages/OrderUpload/SetUploadCancelled": (draft: Draft<OrderUploadState>, action: { parameter: { uploadCancelled: boolean } }) => {
        draft.uploadCancelled = action.parameter.uploadCancelled;
    },
    "Pages/OrderUpload/SetUploadLimitExceeded": (draft: Draft<OrderUploadState>, action: { parameter: { uploadLimitExceeded: boolean } }) => {
        draft.uploadLimitExceeded = action.parameter.uploadLimitExceeded;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
