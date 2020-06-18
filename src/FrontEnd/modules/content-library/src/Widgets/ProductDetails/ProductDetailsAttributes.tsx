import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect } from "react-redux";
import translate from "@insite/client-framework/Translate";
import { css } from "styled-components";

type OwnProps = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    attributeTypes: state.pages.productDetail.product?.attributeTypes,
});

export interface ProductDetailsAttributesStyles {
    wrapper?: InjectableCss;
    attributeTypeLabelText?: TypographyPresentationProps;
    attributeTypeValuesText?: TypographyPresentationProps;
}

const styles: ProductDetailsAttributesStyles = {
    wrapper: {
        css: css` padding-bottom: 15px; `,
    },
    attributeTypeLabelText: {
        weight: "bold",
    },
    attributeTypeValuesText: {
        css: css` margin-bottom: 5px; `,
    },
};

export const attributesStyles = styles;

const ProductDetailsAttributes: React.FC<OwnProps> = ({ product, attributeTypes }) => {
    if (!product.brand && (!attributeTypes || attributeTypes.length === 0)) {
        return null;
    }

    return <StyledWrapper {...styles.wrapper} data-test-selector="productDetails_attributes">
        {product.brand
            && <Typography data-test-selector="brand_item" as="p" {...styles.attributeTypeValuesText}>
                <Typography data-test-selector="brand_item_label" {...styles.attributeTypeLabelText}>{translate("Brand")}&nbsp;:&nbsp;</Typography>
                <span data-test-selector="brand_item_value" >{product.brand.name}</span>
            </Typography>
        }
        {attributeTypes && attributeTypes.slice(0, 5).map(attributeType =>
            <Typography key={attributeType.id.toString()} data-test-selector="attributes_item" data-attributetypeid={attributeType.id} {...styles.attributeTypeValuesText} as="p">
                <Typography data-test-selector="attributes_item_label" {...styles.attributeTypeLabelText}>{attributeType.label}&nbsp;:&nbsp;</Typography>
                <span data-test-selector="attributes_item_value">{attributeType.attributeValues!.map(attributeValue => attributeValue.valueDisplay).join(", ")}</span>
            </Typography>)
        }
    </StyledWrapper>;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withProduct(ProductDetailsAttributes)),
    definition: {
        displayName: "Attributes",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
        isSystem: true,
    },
};

export default widgetModule;
