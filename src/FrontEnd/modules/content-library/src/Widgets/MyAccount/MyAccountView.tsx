import * as React from "react";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Zone from "@insite/client-framework/Components/Zone";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import AccountMessages from "@insite/content-library/Widgets/MyAccount/AccountMessages";
import { MyAccountPageContext } from "@insite/content-library/Pages/MyAccountPage";

interface OwnProps extends WidgetProps {}

type Props = OwnProps;

export interface MyAccountViewStyles {
    quickLinksGridItem?: GridItemProps;
    mainSectionGridItem?: GridItemProps;
    mainSectionGridContainer?: GridContainerProps;
    accountMessagesGridItem?: GridItemProps;
    dashboardWidgetsGridItem?: GridItemProps;
}

const styles: MyAccountViewStyles = {
    quickLinksGridItem: { width: 2 },
    mainSectionGridItem: { width: 10 },
    accountMessagesGridItem: { width: 12 },
    dashboardWidgetsGridItem: { width: 12 },
};

class MyAccountView extends React.PureComponent<Props> {
    render() {
        return (
            <GridContainer>
                <GridItem {...styles.quickLinksGridItem}>
                    <Zone contentId={this.props.id} zoneName="NavigationList" />
                </GridItem>
                <GridItem {...styles.mainSectionGridItem}>
                    <GridContainer {...styles.mainSectionGridContainer}>
                        <GridItem {...styles.accountMessagesGridItem}>
                            <AccountMessages />
                        </GridItem>
                        <GridItem {...styles.dashboardWidgetsGridItem}>
                            <Zone contentId={this.props.id} zoneName="DashboardWidgets" />
                        </GridItem>
                    </GridContainer>
                </GridItem>
            </GridContainer>
        );
    }
}

const myAccountViewWidget: WidgetModule = {
    component: MyAccountView,
    definition: {
        allowedContexts: [MyAccountPageContext],
        group: "My Account",
        fieldDefinitions: [],
    },
};

export default myAccountViewWidget;
