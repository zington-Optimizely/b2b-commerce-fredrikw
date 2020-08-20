import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { canAddAllToList, canSaveOrder, getCurrentCartState, isCartEmpty } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CartPageContext } from "@insite/content-library/Pages/CartPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const cart = getCurrentCartState(state).value;
    return ({
        wishListSettings: getSettingsCollection(state).wishListSettings,
        cart,
        isCartEmpty: isCartEmpty(cart),
        canSaveOrder: canSaveOrder(cart),
        canAddAllToList: canAddAllToList(cart),
        rfqRequestQuotePageUrl: getPageLinkByPageType(state, "RfqRequestQuotePage")?.url,
    });
};

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addToWishList,
};

type Props = WidgetProps & HasHistory & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

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

export const cartActionsStyles: CartActionsStyles = {
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

const styles = cartActionsStyles;

const CartActions: FC<Props> = ({
    cart,
    isCartEmpty,
    canAddAllToList,
    canSaveOrder,
    wishListSettings,
    setAddToListModalIsOpen,
    addToWishList,
    history,
    rfqRequestQuotePageUrl,
}) => {
    if (!cart) {
        return null;
    }

    const toasterContext = React.useContext(ToasterContext);
    const showRequestAQuote = cart.canRequestQuote && !cart.isAwaitingApproval;
    const requestAQuoteLabel = translate(cart.isSalesperson ? "Create a Quote" : "Request a Quote");
    const overflowItems = [];
    const wideHiddenOverflowMenu = [];

    const addAllToListClickHandler = () => {
        if (!wishListSettings) {
            return;
        }

        const productInfos = cart.cartLines?.filter(o => o.productId && o.qtyOrdered).map(cartLine => ({
            productId: cartLine.productId!,
            qtyOrdered: cartLine.qtyOrdered!,
            unitOfMeasure: cartLine.unitOfMeasure,
        })) || [];
        if (!wishListSettings.allowMultipleWishLists) {
            addToWishList({
                productInfos,
                onSuccess: () => {
                    toasterContext.addToast({ body: siteMessage("Lists_ProductAdded"), messageType: "success" });
                },
            });
            return;
        }

        setAddToListModalIsOpen({ modalIsOpen: true, productInfos });
    };

    const requestAQuoteClickHandler = () => {
        if (rfqRequestQuotePageUrl) {
            history.push(rfqRequestQuotePageUrl);
        }
    };

    if (!isCartEmpty) {
        overflowItems.push(<Clickable {...styles.addAllToListClickable}
            key="addAll"
            disabled={!canAddAllToList}
            onClick={addAllToListClickHandler}
            data-test-selector="cartActionsAddAllToList">
            {translate("Add All to List")}
        </Clickable>);
        if (showRequestAQuote) {
            overflowItems.push(<Clickable
                key="requestQuote"
                {...styles.requestAQuoteClickable}
                onClick={requestAQuoteClickHandler}
                data-test-selector="cartActionsRequestAQuote">
                {requestAQuoteLabel}
            </Clickable>);
        }
        wideHiddenOverflowMenu.push(<OverflowMenu
            key="overflow"
            {...styles.wideOverflowMenu}
            data-test-selector="cartActionsOverflowMenu">
            {overflowItems}
        </OverflowMenu>);
    }

    return (
        <>
            <Hidden {...styles.narrowHidden} data-test-selector="cartActionsNarrow">
                <OverflowMenu position="end" {...styles.narrowOverflowMenu}>
                    <Clickable {...styles.saveOrderClickable}
                        disabled={!canSaveOrder}
                        data-test-selector="cartlineSaveOrder">
                            {translate("Save Order")}
                    </Clickable>
                    {overflowItems}
                </OverflowMenu>
            </Hidden>
            <Hidden {...styles.wideHidden} data-test-selector="cartActionsWide">
                <Button
                    {...styles.saveOrderButton}
                    disabled={!canSaveOrder}
                    data-test-selector="cartlineSaveOrder">
                    {translate("Save Order")}
                </Button>
                {wideHiddenOverflowMenu}
            </Hidden>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(CartActions)),
    definition: {
        group: "Cart",
        allowedContexts: [CartPageContext],
    },
};

export default widgetModule;
