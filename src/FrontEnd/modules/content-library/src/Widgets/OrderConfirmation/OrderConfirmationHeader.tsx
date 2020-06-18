import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import translate from "@insite/client-framework/Translate";
import React, { FC } from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { OrderConfirmationPageContext } from "@insite/content-library/Pages/OrderConfirmationPage";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import OverflowMenu, { OverflowMenuProps } from "@insite/mobius/OverflowMenu/OverflowMenu";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import siteMessage from "@insite/client-framework/SiteMessage";
import { connect } from "react-redux";
import { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";

const mapStateToProps = (state: ApplicationState) => ({
    cartState: getCartState(state, state.pages.orderConfirmation.cartId),
    settingsCollection: getSettingsCollection(state),
});

export interface OrderConfirmationHeaderStyles {
    buttonsHiddenContainer?: HiddenProps;
    menuHiddenContainer?: HiddenProps;
    headerGridContainer?: GridContainerProps;
    narrowOverflowMenu?: OverflowMenuProps;
    title: TypographyProps;
    titleGridItem: GridItemProps;
    continueButton?: ButtonPresentationProps;
    printButton?: ButtonPresentationProps;
    buttonGridItem?: GridItemProps;
    printClickable?: ClickableProps;
    continueClickable?: ClickableProps;
    printListModal?: TwoButtonModalStyles;
}

const styles: OrderConfirmationHeaderStyles = {
    continueButton: {
        css: css` margin-left: 10px; `,
    },
    printButton: {
        buttonType: "outline",
        variant: "secondary",
    },
    buttonGridItem: {
        css: css` justify-content: flex-end; `,
        width: [2, 2, 2, 6, 6],
    },
    titleGridItem: {
        width: [10, 10, 10, 6, 6],
    },
    title: {
        variant: "h2",
        as: "p",
        css: css` @media print { font-size: 11px; } `,
    },
    buttonsHiddenContainer: {
        below: "lg",
    },
    menuHiddenContainer: {
        above: "md",
    },
};

type Props = HasHistory & WidgetProps & ReturnType<typeof mapStateToProps>;

export const headerStyles = styles;
const OrderConfirmationHeader: FC<Props> = props => {
    const { cartState } = props;
    const { history } = props;

    const printOrOpenPrintAllModal = () => {
        openPrintDialog();
    };

    if (!cartState.value) {
        return null;
    }

    const continueClickHandler = () => {
        history.push("/");
    };

    const printLabel = translate("Print");
    const continueLabel = translate("Continue Shopping");

    return (
        <GridContainer {...styles.headerGridContainer}>
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.title}>{siteMessage("OrderConfirmation_Success")}</Typography>
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <Hidden {...styles.menuHiddenContainer}>
                    <OverflowMenu position="end" {...styles.narrowOverflowMenu}>
                        <Clickable {...styles.printClickable} onClick={printOrOpenPrintAllModal}>{printLabel}</Clickable>
                        <Clickable {...styles.continueClickable} onClick={continueClickHandler}>{continueLabel}</Clickable>
                    </OverflowMenu>
                </Hidden>
                <Hidden {...styles.buttonsHiddenContainer}>
                    <Button {...styles.printButton} onClick={printOrOpenPrintAllModal}>{printLabel}</Button>
                    <Button {...styles.continueButton} onClick={continueClickHandler}>{continueLabel}</Button>
                </Hidden>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withHistory(OrderConfirmationHeader)),
    definition: {
        displayName: "Page Header",
        allowedContexts: [OrderConfirmationPageContext],
        group: "Order Confirmation",
        isSystem: true,
    },
};

export default widgetModule;
