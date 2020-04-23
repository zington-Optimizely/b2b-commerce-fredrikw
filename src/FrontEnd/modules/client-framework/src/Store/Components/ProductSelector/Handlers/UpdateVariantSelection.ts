import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import {
    TraitValueModel,
    ProductPriceDto,
    VariantTraitModel,
} from "@insite/client-framework/Types/ApiModels";
import cloneDeep from "lodash/cloneDeep";
import { ProductModelExtended, getProductCollectionRealTimePrices } from "@insite/client-framework/Services/ProductServiceV2";
import { getProductSelector } from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorSelectors";

type HandlerType = HandlerWithResult<
    {
        index?: number;
        traitValue?: TraitValueModel;
    },
    {
        selectedVariant: ProductModelExtended,
        variantSelection: (TraitValueModel | undefined)[];
        variantSelectionCompleted: boolean;
        filteredVariantTraits?: VariantTraitModel[]
    }
>;

export const CopyCurrentValues: HandlerType = props => {
    const { variantSelection, variantSelectionCompleted, initialVariantTraits } = getProductSelector(props.getState());
    props.result = {
        selectedVariant: {} as ProductModelExtended,
        variantSelection: cloneDeep(variantSelection),
        variantSelectionCompleted,
        filteredVariantTraits: cloneDeep(initialVariantTraits),
    };
};

export const SetVariantSelection: HandlerType = ({ parameter: { index, traitValue }, result }) => {
    if (index === undefined) {
        return;
    }

    result.variantSelection[index] = traitValue;
};

export const FilterVariantTraits: HandlerType = ({ result, getState }) => {
    // loop trough every trait and compose values
    result.filteredVariantTraits?.forEach((variantTrait) => {
        if (!variantTrait) {
            return;
        }

        let variantdProductsFiltered = getProductSelector(getState()).initialVariantProducts!.slice();

        // iteratively filter products for selected traits (except current)
        result.variantSelection.forEach((traitValue) => {
            if (traitValue && variantTrait.traitValues!.every(o => o.id !== traitValue.id)) {
                variantdProductsFiltered = getProductsByVariantTraitValueId(variantdProductsFiltered, traitValue.id);
            }
        });

        // for current trait get all distinct values in filtered products
        const filteredValuesIds: string[] = [];
        variantdProductsFiltered.forEach((product) => {
            // get values for current product
            const currentValue = product.childTraitValues!.find(traitValue => traitValue.styleTraitId === variantTrait.id);
            // check if value already selected
            const isCurrentValueInFilteredList = currentValue && filteredValuesIds.some(filteredValueId => filteredValueId === currentValue.id);
            if (currentValue && !isCurrentValueInFilteredList) {
                filteredValuesIds.push(currentValue.id);
            }
        });
        variantTrait.traitValues = variantTrait.traitValues!.filter(traitValue => filteredValuesIds.indexOf(traitValue.id) > -1);
    });
};

export const SetVariantSelectionCompleted: HandlerType = ({ result }) => {
    result.variantSelectionCompleted = result.variantSelection.every(item => item !== undefined && item !== null);
};

export const SelectVariantProduct: HandlerType = async ({ result, getState }) => {
    if (!result.variantSelectionCompleted) {
        result.selectedVariant = result.selectedVariant.id ? {} as ProductModelExtended : result.selectedVariant;
        return;
    }

    const initialVariantProducts = getProductSelector(getState()).initialVariantProducts!;
    const selectedVariantProduct = getSelectedVariantProduct(result.variantSelection, initialVariantProducts);
    if (!selectedVariantProduct) {
        return;
    }

    const product = result.selectedVariant;
    product.id = selectedVariantProduct.id;
    product.productNumber = selectedVariantProduct.productNumber;
    product.pricing = selectedVariantProduct.pricing;
    product.productTitle = selectedVariantProduct.productTitle;

    const products = initialVariantProducts.map((product) => {
        return {
            id: product.id,
            selectedUnitOfMeasure: product?.selectedUnitOfMeasure || "",
            qtyOrdered: product?.qtyOrdered || 1,
        } as ProductModelExtended;
    });

    const realTimePricing = await getProductCollectionRealTimePrices({ products });
    if (realTimePricing.realTimePricingResults) {
        realTimePricing.realTimePricingResults.forEach((productPrice: ProductPriceDto) => {
            const variant = initialVariantProducts.find((p: ProductModelExtended) => p.id === productPrice.productId);
            if (variant && variant.id === product.id) {
                product.pricing = productPrice;
            }
        });
    }
};

export const DispatchUpdateVariantSelection: HandlerType = ({ result, dispatch }) => {
    dispatch({
        type: "Components/ProductSelector/UpdateVariantSelection",
        selectedVariant: result.selectedVariant,
        variantSelection: result.variantSelection,
        variantSelectionCompleted: result.variantSelectionCompleted,
        filteredVariantTraits: result.filteredVariantTraits,
    });
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

export const chain = [
    CopyCurrentValues,
    SetVariantSelection,
    FilterVariantTraits,
    SetVariantSelectionCompleted,
    SelectVariantProduct,
    DispatchUpdateVariantSelection,
];

const updateVariantSelection = createHandlerChainRunner(chain, "UpdateVariantSelection");
export default updateVariantSelection;
