import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getQuotesDataView } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import toggleFiltersOpen from "@insite/client-framework/Store/Pages/RfqMyQuotes/Handlers/ToggleFiltersOpen";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqMyQuotesPageContext } from "@insite/content-library/Pages/RfqMyQuotesPage";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconProps } from "@insite/mobius/Icon";
import Filter from "@insite/mobius/Icons/Filter";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    quotesDataView: getQuotesDataView(state, state.pages.rfqMyQuotes.getQuotesParameter),
});

const mapDispatchToProps = {
    toggleFiltersOpen,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqMyQuotesHeaderStyles {
    container?: GridContainerProps;
    quoteCountGridItem?: GridItemProps;
    quoteCountText?: TypographyPresentationProps;
    emptyGridItem?: GridItemProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconProps;
}

export const rfqMyQuotesHeaderStyles: RfqMyQuotesHeaderStyles = {
    container: {
        gap: 8,
        css: css`
            padding-bottom: 10px;
        `,
    },
    quoteCountGridItem: {
        width: 11,
        style: { marginTop: "8px" },
    },
    quoteCountText: { weight: 800 },
    toggleFilterGridItem: {
        width: 1,
        style: { marginTop: "8px", justifyContent: "flex-end" },
    },
    toggleFilterIcon: { size: 24 },
};

const styles = rfqMyQuotesHeaderStyles;

const RfqMyQuotesHeader = ({ id, quotesDataView, toggleFiltersOpen }: Props) => {
    const quotesCount =
        quotesDataView.value && quotesDataView.pagination ? quotesDataView.pagination.totalItemCount : 0;

    return (
        <>
            <Zone contentId={id} zoneName="Content00" />
            <GridContainer {...styles.container}>
                <GridItem {...styles.quoteCountGridItem}>
                    <Typography {...styles.quoteCountText} data-test-selector="rfqMyQuotes_count">
                        {quotesCount === 1 && translate("{0} Quote", quotesCount.toString())}
                        {quotesCount > 1 && translate("{0} Quotes", quotesCount.toString())}
                    </Typography>
                </GridItem>
                <GridItem {...styles.toggleFilterGridItem}>
                    <Clickable onClick={toggleFiltersOpen} data-test-selector="rfqMyQuotes_toggleFilter">
                        <VisuallyHidden>{translate("toggle filter")}</VisuallyHidden>
                        <Icon src={Filter} {...styles.toggleFilterIcon} />
                    </Clickable>
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqMyQuotesHeader),
    definition: {
        group: "RFQ My Quotes",
        displayName: "Page Header",
        allowedContexts: [RfqMyQuotesPageContext],
    },
};

export default widgetModule;
