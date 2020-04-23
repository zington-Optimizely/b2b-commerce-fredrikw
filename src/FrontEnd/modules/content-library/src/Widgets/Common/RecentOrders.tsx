import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import CardList, { CardListStyles } from "@insite/content-library/Components/CardList";
import CardListHeading from "@insite/content-library/Components/CardListHeading";
import CardContainer, { CardContainerStyles } from "@insite/content-library/Components/CardContainer";
import OrderSummaryCard, { OrderSummaryCardStyles } from "@insite/content-library/Components/OrderSummaryCard";
import loadOrders from "@insite/client-framework/Store/Data/Orders/Handlers/LoadOrders";
import { getOrdersDataView } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

const mapStateToProps = (state: ApplicationState) => ({
    ordersDataView: getOrdersDataView(state, recentOrdersParameter),
    orderHistoryPageLink: getPageLinkByPageType(state, "OrderHistoryPage"),
    settingsCollection: getSettingsCollection(state),
});

const mapDispatchToProps = {
    loadOrders,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RecentOrdersStyles {
    cardList?: CardListStyles;
    errorGridItem?: GridItemProps;
    errorText?: TypographyPresentationProps;
    noOrdersFoundGridItem?: GridItemProps;
    noOrdersFoundText?: TypographyPresentationProps;
    cardContainer?: CardContainerStyles;
    orderSummaryCard?: OrderSummaryCardStyles;
}

const styles: RecentOrdersStyles = {
    errorGridItem: { width: 12 },
    noOrdersFoundGridItem: { width: 12 },
};

const recentOrdersParameter = {
    page: 1,
    pageSize: 5,
    sort: "OrderDate DESC",
};

export const recentOrdersStyles = styles;

class RecentOrders extends React.Component<Props> {
    componentDidMount() {
        if (!this.props.ordersDataView.value) {
            this.props.loadOrders(recentOrdersParameter);
        }
    }

    render() {
        const { ordersDataView, orderHistoryPageLink, settingsCollection } = this.props;

        const orderHistoryUrl = orderHistoryPageLink ? orderHistoryPageLink.url : undefined;

        if (!ordersDataView.value) {
            return null;
        }

        return (
            <CardList extendedStyles={styles.cardList}>
                <CardListHeading heading={translate("Recent Orders")} viewAllUrl={orderHistoryUrl} />
                {ordersDataView.value.length === 0
                    && <GridItem {...styles.noOrdersFoundGridItem}>
                        <Typography {...styles.noOrdersFoundText}>{translate("No orders found")}</Typography>
                    </GridItem>
                }
                {ordersDataView.value.map(order => order !== null && (
                    <CardContainer key={order.id} extendedStyles={styles.cardContainer}>
                        <OrderSummaryCard
                            order={order}
                            orderSettings={settingsCollection.orderSettings}
                            extendedStyles={styles.orderSummaryCard} />
                    </CardContainer>
                ))}
            </CardList>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RecentOrders),
    definition: {
        group: "Common",
        icon: "List",
        fieldDefinitions: [],
    },
};

export default widgetModule;
