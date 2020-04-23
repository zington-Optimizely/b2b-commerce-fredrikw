import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CartPageContext } from "@insite/content-library/Pages/CartPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";
import { getCurrentCartState, isCartEmpty, canAddAllToList, canSaveOrder } from "@insite/client-framework/Store/Data/Carts/CartsSelector";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => {
    const cart = getCurrentCartState(state).value;
    return ({
        cart,
        isCartEmpty: isCartEmpty(cart),
        canSaveOrder: canSaveOrder(cart),
        canAddAllToList: canAddAllToList(cart),
    });
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface CartActionsStyles {
    narrowHidden?: HiddenProps;
    narrowOverflowMenu?: OverflowMenuPresentationProps;
    saveOrderClickable?: ClickablePresentationProps;
    addAllToListClickable?: ClickablePresentationProps;
    requestAQuoteClickable?: ClickablePresentationProps;
    wideHidden?: HiddenProps;
    wideOverflowMenu?: OverflowMenuPresentationProps;
    saveOrderButton?: ButtonPresentationProps;
}

const styles: CartActionsStyles = {
    narrowHidden: {
        above: "sm",
        css: css`
            display: flex;
            justify-content: flex-end;
        `,
    },
    wideHidden: {
        below: "md",
        css: css`
            display: flex;
            justify-content: flex-end;
        `,
    },
    saveOrderButton: {
        color: "secondary",
    },
    wideOverflowMenu: {
        cssOverrides: {
            wrapper: css` margin-left: 20px; `,
        },
    },
};

export const cartActionsStyles = styles;

const CartActions: FC<Props> = ({
    cart,
    isCartEmpty,
    ...otherProps
}) => {
    if (!cart) {
        return null;
    }

    const showRequestAQuote = cart.canRequestQuote && !cart.isAwaitingApproval;
    const requestAQuoteLabel = translate(cart.isSalesperson ? "Create a Quote" : "Request a Quote");
    const overflowItems = [];
    const wideHiddenOverflowMenu = [];

    if (!isCartEmpty) {
        overflowItems.push(<Clickable {...styles.addAllToListClickable}
            key="addAll"
            disabled={!otherProps.canAddAllToList}
            data-test-selector="cartlineAddAllToList">
            {translate("Add All to List")}
        </Clickable>);
        if (showRequestAQuote) {
            overflowItems.push(<Clickable key="requestQuote" {...styles.requestAQuoteClickable}>{requestAQuoteLabel}</Clickable>);
        }
        wideHiddenOverflowMenu.push(<OverflowMenu key="overflow" {...styles.wideOverflowMenu}>{overflowItems}</OverflowMenu>);
    }

    return (
        <>
            <Hidden {...styles.narrowHidden} data-test-selector="cartActionsNarrow">
                <OverflowMenu {...styles.narrowOverflowMenu}>
                    <Clickable {...styles.saveOrderClickable}
                        disabled={!otherProps.canSaveOrder}
                        data-test-selector="cartlineSaveOrder">
                        {translate("Save Order")}
                    </Clickable>
                    {overflowItems}
                </OverflowMenu>
            </Hidden>
            <Hidden {...styles.wideHidden} data-test-selector="cartActionsWide">
                <Button
                    {...styles.saveOrderButton}
                    disabled={!otherProps.canSaveOrder}
                    data-test-selector="cartlineSaveOrder">
                    {translate("Save Order")}
                </Button>
                {wideHiddenOverflowMenu}
            </Hidden>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(CartActions),
    definition: {
        group: "Cart",
        allowedContexts: [CartPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
