import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductShareLink, { ProductShareLinkStyles } from "@insite/content-library/Components/ProductShareLink";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

type OwnProps = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    variantSelectionCompleted: state.pages.productDetail.variantSelectionCompleted,
});

export interface ProductDetailsShareLinkStyles {
    wrapper?: InjectableCss;
    link?: ProductShareLinkStyles;
}

const styles: ProductDetailsShareLinkStyles = {
    wrapper: {
        css: css`
            margin-top: 30px;
            text-align: center;
        `,
    },
};

export const shareLinkStyles = styles;

const ProductDetailsShareLink: React.FC<OwnProps> = ({
    product,
}) => {
    if (!product) {
        return null;
    }

    return <StyledWrapper {...styles.wrapper}>
        <ProductShareLink
            extendedStyles={styles.link} />
    </StyledWrapper>;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withProduct(ProductDetailsShareLink)),
    definition: {
        displayName: "Share Link",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
    },
};

export default widgetModule;
