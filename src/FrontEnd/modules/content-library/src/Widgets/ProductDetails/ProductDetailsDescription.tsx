import parse from "html-react-parser";
import * as React from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";

interface OwnProps extends WidgetProps, HasProductContext {
}

export interface ProductDetailsDescriptionStyles {
    wrapper?: InjectableCss;
}

const styles: ProductDetailsDescriptionStyles = {
    wrapper: {
        css: css` margin-bottom: 15px; `,
    },
};

export const descriptionStyles = styles;

const ProductDetailsDescription: React.FC<OwnProps> = ({ product }) => {
    if (!product.content) {
        return null;
    }

    return <StyledWrapper {...styles.wrapper}>
        <div data-test-selector="productDetails_htmlContent">
            {parse(product.content.htmlContent, parserOptions)}
        </div>
    </StyledWrapper>;
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsDescription),
    definition: {
        displayName: "Description",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
