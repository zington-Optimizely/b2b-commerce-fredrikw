import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import updateVariantSelection from "@insite/client-framework/Store/Pages/ProductDetail/Handlers/UpdateVariantSelection";
import translate from "@insite/client-framework/Translate";
import { VariantTraitModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import Select, { SelectProps } from "@insite/mobius/Select";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

type OwnProps = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ApplicationState) => {
    return {
        parentProduct: state.pages.productDetail.parentProduct,
        initialVariantTraits: state.pages.productDetail.initialVariantTraits,
        initialVariantProducts: state.pages.productDetail.initialVariantProducts,
        variantSelection: state.pages.productDetail.variantSelection,
        variantSelectionCompleted: state.pages.productDetail.variantSelectionCompleted,
        filteredVariantTraits: state.pages.productDetail.filteredVariantTraits,
    };
};

const mapDispatchToProps = {
    updateVariantSelection,
};

export interface ProductDetailsVariantOptionsStyles {
    wrapper?: InjectableCss;
    select?: SelectProps;
}

const styles: ProductDetailsVariantOptionsStyles = {
    wrapper: {
        css: css` width: 100%; `,
    },
    select: {
        cssOverrides: { formField: css` margin-top: 10px; ` },
    },
};

export const variantOptionsStyles = styles;

const ProductDetailsVariantOptions: React.FC<OwnProps> = ({
    filteredVariantTraits,
    variantSelection,
    updateVariantSelection,
}) => {
    const variantChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>, index: number, variantTrait: VariantTraitModel) => {
        const traitValue = variantTrait.traitValues!.find(item => `${item.id}` === event.currentTarget.value);
        updateVariantSelection({ index, traitValue });
    };

    if (!filteredVariantTraits || filteredVariantTraits.length === 0) {
        return null;
    }

    return <StyledWrapper {...styles.wrapper}>
        {filteredVariantTraits.slice().sort((a, b) => a.sortOrder - b.sortOrder).map((variantTrait, index) =>
            <Select
                {...styles.select}
                key={variantTrait.id.toString()}
                label={variantTrait.nameDisplay}
                value={variantSelection[index] ? `${variantSelection[index]!.id}` : ""}
                onChange={(event) => { variantChangeHandler(event, index, variantTrait); }}
                data-test-selector={`styleSelect_${variantTrait.name}`}
            >
                <option value="">{variantTrait.unselectedValue ? variantTrait.unselectedValue : `${translate("Select")} ${variantTrait.nameDisplay}`}</option>
                {variantTrait.traitValues?.slice().sort((a, b) => a.sortOrder - b.sortOrder).map(traitValue =>
                    <option value={`${traitValue.id}`} key={`${traitValue.id}`}>{traitValue.valueDisplay}</option>)
                }
            </Select>)
        }
    </StyledWrapper>;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withProduct(ProductDetailsVariantOptions)),
    definition: {
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
    },
};

export default widgetModule;
