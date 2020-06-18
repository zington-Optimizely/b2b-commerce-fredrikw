import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import Typography from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import Link from "@insite/mobius/Link";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => {
    const productCollection = state.pages.productList.productsState.value;
    if (productCollection) {
        return {
            didYouMeanSuggestions: productCollection.didYouMeanSuggestions,
            correctedQuery: productCollection.correctedQuery,
            originalQuery: productCollection.originalQuery,
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

const styles: ProductListSuggestionStyles = {};

export const suggestionStyles = styles;

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
        isSystem: true,
    },
};

export default widgetModule;
