import { createHandlerChainRunnerOptionalParameter, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import cloneDeep from "lodash/cloneDeep";
import {
    VariantTraitModel,
} from "@insite/client-framework/Types/ApiModels";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

type HandlerType = HandlerWithResult<{}, { filteredVariantTraits: VariantTraitModel[] }>;

export const DispatchBeginFilterVariantTraits: HandlerType = ({ dispatch }) => {
    dispatch({
        type: "Pages/ProductDetail/BeginFilterVariantTraits",
    });
};

export const CopyVariantTraits: HandlerType = props => {
    const initialVariantTraits = props.getState().pages.productDetail.initialVariantTraits;
    if (!initialVariantTraits || initialVariantTraits.length === 0) {
        return false;
    }

    // init variant traits to display
    props.result = { filteredVariantTraits: cloneDeep(initialVariantTraits) };
};

export const FilterVariantTraits: HandlerType = ({ result, getState }) => {
    // loop trough every trait and compose values
    result.filteredVariantTraits.forEach((variantTrait) => {
        if (!variantTrait) {
            return;
        }

        let variantdProductsFiltered = getState().pages.productDetail.initialVariantProducts!.slice();

        // iteratively filter products for selected traits (except current)
        getState().pages.productDetail.variantSelection.forEach((traitValue) => {
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

export const DispatchCompleteFilterVariantTraits: HandlerType = ({ result, dispatch }) => {
    dispatch({
        type: "Pages/ProductDetail/CompleteFilterVariantTraits",
        filteredVariantTraits: result?.filteredVariantTraits,
    });
};

function getProductsByVariantTraitValueId(variantdProducts: ProductModelExtended[], variantTraitValueId: string) {
    return variantdProducts.filter(product => product.childTraitValues!.some(value => value.id === variantTraitValueId));
}

export const chain = [
    DispatchBeginFilterVariantTraits,
    CopyVariantTraits,
    FilterVariantTraits,
    DispatchCompleteFilterVariantTraits,
];

const filterVariantTraits = createHandlerChainRunnerOptionalParameter(chain, {}, "FilterVariantTraits");
export default filterVariantTraits;
