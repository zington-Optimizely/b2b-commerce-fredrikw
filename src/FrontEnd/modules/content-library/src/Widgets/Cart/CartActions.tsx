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
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";
import { getCurrentCartState, isCartEmpty, canAddAllToList, canSaveOrder } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import siteMessage from "@insite/client-framework/SiteMessage";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

const mapStateToProps = (state: ApplicationState) => {
    const cart = getCurrentCartState(state).value;
    return ({
        wishListSettings: getSettingsCollection(state).wishListSettings,
        cart,
        isCartEmpty: isCartEmpty(cart),
        canSaveOrder: canSaveOrder(cart),
        canAddAllToList: canAddAllToList(cart),
    });
};

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addToWishList,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

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
    canAddAllToList,
    canSaveOrder,
    wishListSettings,
    setAddToListModalIsOpen,
    addToWishList,
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

        const products = cart.cartLines?.map(cartLine => ({
            id: cartLine.productId,
            qtyOrdered: cartLine.qtyOrdered,
            selectedUnitOfMeasure: cartLine.unitOfMeasure,
        }) as ProductModelExtended) || [];
        if (!wishListSettings.allowMultipleWishLists) {
            addToWishList({
                products,
                onSuccess: () => {
                    toasterContext.addToast({ body: siteMessage("Lists_ProductAdded"), messageType: "success" });
                },
            });
            return;
        }

        setAddToListModalIsOpen({ modalIsOpen: true, products });
    };

    if (!isCartEmpty) {
        overflowItems.push(<Clickable {...styles.addAllToListClickable}
            key="addAll"
            disabled={!canAddAllToList}
            onClick={addAllToListClickHandler}
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
    component: connect(mapStateToProps, mapDispatchToProps)(CartActions),
    definition: {
        group: "Cart",
        allowedContexts: [CartPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
