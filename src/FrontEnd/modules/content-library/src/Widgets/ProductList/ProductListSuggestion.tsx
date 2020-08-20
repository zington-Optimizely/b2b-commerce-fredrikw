import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getProductListDataView } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import Link from "@insite/mobius/Link";
import Typography from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => {
    const productsDataView = getProductListDataView(state);
    if (productsDataView.value) {
        return {
            didYouMeanSuggestions: productsDataView.didYouMeanSuggestions,
            correctedQuery: productsDataView.correctedQuery,
            originalQuery: productsDataView.originalQuery,
        };
    }
    return {};
};

const mapDispatchToProps = {
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListSuggestionStyles {
    wrapper?: InjectableCss;
}

export const suggestionStyles: ProductListSuggestionStyles = {};

const styles = suggestionStyles;

const ProductListSuggestion: FC<Props> = ({ didYouMeanSuggestions, originalQuery, correctedQuery }) => {
    return (
        <StyledWrapper {...styles.wrapper}>
            {didYouMeanSuggestions && didYouMeanSuggestions.length > 0
                && <>
                    <Typography>{translate("Did you mean ")}</Typography>
                    <Link href={`/Search?query=${didYouMeanSuggestions[0].suggestion}`}>{didYouMeanSuggestions[0].suggestion}</Link>
                </>
            }
            {correctedQuery && originalQuery !== correctedQuery
                && <>
                    <Typography>{translate("Search instead for ")}</Typography>
                    <Link
                        href={`/Search?query=${originalQuery}&includeSuggestions=false`}
                        data-test-selector="productListOriginalQuery">
                        {originalQuery}
                    </Link>
                </>
            }
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(ProductListSuggestion),
    definition: {
        group: "Product List",
        displayName: "Suggestion",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
