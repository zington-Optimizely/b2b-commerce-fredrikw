import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import * as React from "react";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import CardList, { CardListStyles } from "@insite/content-library/Components/CardList";
import CardListHeading from "@insite/content-library/Components/CardListHeading";
import CardContainer, { CardContainerStyles } from "@insite/content-library/Components/CardContainer";
import QuoteSummaryCard, { QuoteSummaryCardStyles } from "@insite/content-library/Components/QuoteSummaryCard";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getQuotesDataView } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import loadQuotes from "@insite/client-framework/Store/Data/Quotes/Handlers/LoadQuotes";

const mapStateToProps = (state: ApplicationState) => ({
    settingsCollection: getSettingsCollection(state),
    session: state.context.session,
    quotesDataView: getQuotesDataView(state, recentQuotesParameter),
    myQuotesPageNavLink: getPageLinkByPageType(state, "RfqMyQuotesPage"),
});

const mapDispatchToProps = {
    loadQuotes,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RecentQuotesStyles {
    cardList?: CardListStyles;
    noQuotesGridItem?: GridItemProps;
    noQuotesText?: TypographyPresentationProps;
    cardContainer?: CardContainerStyles;
    quoteSummaryCard?: QuoteSummaryCardStyles;
}

const styles: RecentQuotesStyles = {
    noQuotesGridItem: { width: 12 },
};

const recentQuotesParameter = {
    page: 1,
    pageSize: 5,
};

export const recentQuotesStyles = styles;

class RecentQuotes extends React.Component<Props> {
    componentDidMount() {
        if (!this.props.quotesDataView.value) {
            this.props.loadQuotes(recentQuotesParameter);
        }
    }

    render() {
        const { settingsCollection, session, quotesDataView, myQuotesPageNavLink } = this.props;
        if (!quotesDataView.value) {
            return null;
        }

        const myQuotesPageUrl = myQuotesPageNavLink ? myQuotesPageNavLink.url : undefined;

        return (
            <CardList extendedStyles={styles.cardList}>
                <CardListHeading heading={translate("Recent Quotes")} viewAllUrl={myQuotesPageUrl} />
                {quotesDataView.value.length === 0
                    && <GridItem {...styles.noQuotesGridItem}>
                        <Typography {...styles.noQuotesText}>{siteMessage("Rfq_NoQuotesMessage")}</Typography>
                    </GridItem>
                }
                {quotesDataView.value.map(quote => (
                    <CardContainer key={quote.id} extendedStyles={styles.cardContainer}>
                        <QuoteSummaryCard
                            quote={quote}
                            session={session}
                            quoteSettings={settingsCollection.quoteSettings}
                            extendedStyles={styles.quoteSummaryCard} />
                    </CardContainer>
                ))}
            </CardList>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RecentQuotes),
    definition: {
        group: "Common",
        icon: "List",
        fieldDefinitions: [],
    },
};

export default widgetModule;
