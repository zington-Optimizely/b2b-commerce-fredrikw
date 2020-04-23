import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import {
    TraitValueModel,
    UnitOfMeasureModel,
} from "@insite/client-framework/Types/ApiModels";
import cloneDeep from "lodash/cloneDeep";
import changeProductUnitOfMeasure from "@insite/client-framework/Store/CommonHandlers/ChangeProductUnitOfMeasure";
import filterVariantTraits from "@insite/client-framework/Store/Pages/ProductDetail/Handlers/FilterVariantTraits";
import updateProduct from "@insite/client-framework/Store/Pages/ProductDetail/Handlers/UpdateProduct";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

type HandlerType = HandlerWithResult<
    {
        index?: number;
        traitValue?: TraitValueModel;
    },
    {
        product: ProductModelExtended,
        variantSelection: (TraitValueModel | undefined)[];
        variantSelectionCompleted: boolean;
        needUpdateUnitOfMeasure?: boolean;
    }
>;

export const CopyCurrentValues: HandlerType = props => {
    const productDetail = props.getState().pages.productDetail;
    props.result = {
        product: cloneDeep(productDetail.product!),
        variantSelection: cloneDeep(productDetail.variantSelection),
        variantSelectionCompleted: productDetail.variantSelectionCompleted,
    };
};

export const SetVariantSelection: HandlerType = ({ parameter: { index, traitValue }, result }) => {
    if (index === undefined) {
        return;
    }

    result.variantSelection[index] = traitValue;
};

export const SetVariantSelectionCompleted: HandlerType = ({ result }) => {
    result.variantSelectionCompleted = result.variantSelection.every(item => item !== undefined && item !== null);
};

export const SelectVariantProduct: HandlerType = ({ result, getState }) => {
    if (!result.variantSelectionCompleted) {
        return;
    }

    const selectedVariantProduct = getSelectedVariantProduct(result.variantSelection, getState().pages.productDetail.initialVariantProducts!);
    if (!selectedVariantProduct) {
        return;
    }

    const product = result.product;
    product.productNumber = selectedVariantProduct.productNumber;
    product.smallImagePath = selectedVariantProduct.smallImagePath;
    product.mediumImagePath = selectedVariantProduct.mediumImagePath;
    product.largeImagePath = selectedVariantProduct.largeImagePath;
    product.id = selectedVariantProduct.id;
    product.quoteRequired = selectedVariantProduct.quoteRequired;
    product.productTitle = selectedVariantProduct.productTitle;
    product.availability = selectedVariantProduct.availability;
    product.inventoryAvailabilities = selectedVariantProduct.inventoryAvailabilities;
    product.unitOfMeasures = selectedVariantProduct.unitOfMeasures;
    product.images = selectedVariantProduct.images;
    product.trackInventory = selectedVariantProduct.trackInventory;
    product.minimumOrderQty = selectedVariantProduct.minimumOrderQty;
    product.canonicalUrl = selectedVariantProduct.canonicalUrl;

    if (product.qtyOrdered < product.minimumOrderQty) {
        product.qtyOrdered = product.minimumOrderQty;
    }
    product.qtyOrdered = product.qtyOrdered || 1;

    if (product.unitOfMeasures && product.unitOfMeasures.length > 1) {
        if (!product.selectedUnitOfMeasure) {
            product.selectedUnitOfMeasure = getDefaultValue(product.unitOfMeasures);
        } else if (product.unitOfMeasures.every(elem => elem.unitOfMeasure !== product.selectedUnitOfMeasure)) {
            product.unitOfMeasureDisplay = "";
        }
        result.needUpdateUnitOfMeasure = true;
    } else if (product.unitOfMeasures && product.unitOfMeasures.length === 1) {
        product.selectedUnitOfMeasure = product.unitOfMeasures[0].unitOfMeasure;
        result.needUpdateUnitOfMeasure = true;
    } else {
        product.unitOfMeasureDisplay = "";
        product.pricing = selectedVariantProduct.pricing;
    }

    product.isVariantParent = false;
};

export const SelectParentProduct: HandlerType = ({ result, getState }) => {
    if (result.variantSelectionCompleted || result.product.isVariantParent) {
        return;
    }

    // displaying parent product when variant selection is not completed and variantd product was displayed
    const parentProduct = getState().pages.productDetail.parentProduct!;
    const needResetUnitOfMeasure = parentProduct.unitOfMeasures
        && parentProduct.unitOfMeasures.length > 0
        && parentProduct.unitOfMeasures.every(elem => elem.unitOfMeasure !== result.product!.selectedUnitOfMeasure);
    result.product = cloneDeep(parentProduct);
    if (needResetUnitOfMeasure) {
        result.product.selectedUnitOfMeasure = getDefaultValue(result.product.unitOfMeasures!);
        result.needUpdateUnitOfMeasure = true;
    }
};

export const DispatchUpdateVariantSelection: HandlerType = ({ result, dispatch }) => {
    dispatch({
        type: "Pages/ProductDetail/UpdateVariantSelection",
        product: result.product,
        variantSelection: result.variantSelection,
        variantSelectionCompleted: result.variantSelectionCompleted,
    });
};

export const FilterVariantTraits: HandlerType = ({ dispatch, getState }) => {
    filterVariantTraits()(dispatch, getState);
};

export const UpdateUnitOfMeasure: HandlerType = ({ result: { product, needUpdateUnitOfMeasure }, getState, dispatch }) => {
    if (!needUpdateUnitOfMeasure) {
        return;
    }

    const onSuccessUomChanged = (product: ProductModelExtended) => {
        updateProduct({ product })(dispatch, getState);
    };

    changeProductUnitOfMeasure({ product, selectedUnitOfMeasure: product.selectedUnitOfMeasure, onSuccess: onSuccessUomChanged })(dispatch, getState);
};

function getSelectedVariantProduct(variantSelection: (TraitValueModel | undefined)[], variantdProducts: ProductModelExtended[]) {
    let filteredVariantdProducts = variantdProducts.slice();
    variantSelection.forEach((traitValue) => {
        filteredVariantdProducts = getProductsByVariantTraitValueId(filteredVariantdProducts, traitValue!.id);
    });

    return (filteredVariantdProducts && filteredVariantdProducts.length > 0) ? filteredVariantdProducts[0] : null;
}

function getProductsByVariantTraitValueId(variantdProducts: ProductModelExtended[], variantTraitValueId: string) {
    return variantdProducts.filter(product => product.childTraitValues!.some(value => value.id === variantTraitValueId));
}

function getDefaultValue(unitOfMeasures: UnitOfMeasureModel[]): string {
    const defaultMeasures = unitOfMeasures.filter(value => value.isDefault);
    return defaultMeasures.length > 0
        ? defaultMeasures[0].unitOfMeasure
        : unitOfMeasures[0].unitOfMeasure;
}

export const chain = [
    CopyCurrentValues,
    SetVariantSelection,
    SetVariantSelectionCompleted,
    SelectVariantProduct,
    SelectParentProduct,
    DispatchUpdateVariantSelection,
    FilterVariantTraits,
    UpdateUnitOfMeasure,
];

const updateVariantSelection = createHandlerChainRunner(chain, "UpdateVariantSelection");
export default updateVariantSelection;
