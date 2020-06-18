import * as React from "react";
import { css } from "styled-components";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Zone from "@insite/client-framework/Components/Zone";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect } from "react-redux";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    filtersOpen: state.pages.orderHistory.filtersOpen,
});

export interface OrderHistorySearchFormStyles {
    wrapper?: InjectableCss;
    headingText?: TypographyPresentationProps;
}

const styles: OrderHistorySearchFormStyles = {
    wrapper: { css: css` margin-bottom: 10px; ` },
    headingText: { variant: "h5" },
};

export const searchFormStyles = styles;

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

const OrderHistorySearchForm: React.FunctionComponent<Props> = (props) => {
    if (!props.filtersOpen) {
        return null;
    }

    return(
        <StyledWrapper {...styles.wrapper}>
            <Typography as="h3" {...styles.headingText}>{translate("Filter")}</Typography>
            <Zone contentId={props.id} zoneName="Content"/>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(OrderHistorySearchForm),
    definition: {
        group: "Order History",
        displayName: "Search Form",
        allowedContexts: [OrderHistoryPageContext],
        isSystem: true,
    },
};

export default widgetModule;
