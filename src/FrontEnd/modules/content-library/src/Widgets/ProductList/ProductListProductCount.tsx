import React, { FC } from "react";
import { connect } from "react-redux";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    productsState: state.pages.productList.productsState,
    productFilters: state.pages.productList.productFilters,
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

export interface ProductListProductCountStyles {
    wrapper?: InjectableCss;
    countText?: TypographyPresentationProps;
    itemsText?: TypographyPresentationProps;
    queryText?: TypographyPresentationProps;
}

const styles: ProductListProductCountStyles = {
    wrapper: {
        css: css` margin-top: 10px; `,
    },
    countText: {
        css: css` white-space: nowrap; `,
    },
    queryText: {
        css: css`
            white-space: nowrap;
            font-weight: bold;
        `,
    },
};

export const productCountStyles = styles;

const ProductListProductCount: FC<Props> = ({ productsState, productFilters }) => {
    if (!productsState.value) {
        return null;
    }

    const count = productsState.value.pagination!.totalItemCount;
    const query = productsState.value.correctedQuery || productFilters.query;
    const itemsText = (count !== 1 ? " items" : " item") + (query ? " for " : "");

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.countText} data-test-selector="productListCountText">{count}</Typography>
            <Typography {...styles.itemsText}>{translate(itemsText)}</Typography>
            {query && <Typography {...styles.queryText} data-test-selector="productListQueryText">{query}</Typography>}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps)(ProductListProductCount),
    definition: {
        group: "Product List",
        displayName: "Product List Count",
        allowedContexts: [ProductListPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
