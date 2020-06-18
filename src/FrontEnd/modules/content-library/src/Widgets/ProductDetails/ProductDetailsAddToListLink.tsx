import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect } from "react-redux";
import ProductAddToListLink, { ProductAddToListLinkStyles } from "@insite/content-library/Components/ProductAddToListLink";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";

type OwnProps = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    variantSelectionCompleted: state.pages.productDetail.variantSelectionCompleted,
});

export interface ProductDetailsAddToListLinkStyles {
    wrapper?: InjectableCss;
    link?: ProductAddToListLinkStyles;
}

const styles: ProductDetailsAddToListLinkStyles = {
    wrapper: {
        css: css`
            margin-top: 30px;
            text-align: center;
        `,
    },
};

export const addToListLinkStyles = styles;

const ProductDetailsAddToListLink: React.FC<OwnProps> = ({
    product,
    variantSelectionCompleted,
}) => {
    if (!product) {
        return null;
    }

    return <StyledWrapper {...styles.wrapper}>
        <ProductAddToListLink
            product={product}
            variantSelectionCompleted={variantSelectionCompleted}
            data-test-selector="productDetails_addToList"
            extendedStyles={styles.link} />
    </StyledWrapper>;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withProduct(ProductDetailsAddToListLink)),
    definition: {
        displayName: "Add to List Link",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
        isSystem: true,
    },
};

export default widgetModule;
