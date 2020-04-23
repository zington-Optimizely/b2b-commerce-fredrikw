import React, { FC, useState } from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import translate from "@insite/client-framework/Translate";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import Clickable from "@insite/mobius/Clickable";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { QuickOrderPageContext } from "@insite/content-library/Pages/QuickOrderPage";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import addCartLines from "@insite/client-framework/Store/Data/Carts/Handlers/AddCartLines";
import clearProducts from "@insite/client-framework/Store/Pages/QuickOrder/Handlers/ClearProducts";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import siteMessage from "@insite/client-framework/SiteMessage";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";

const enum fields {
    useOverflowMenu = "useOverflowMenu",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.useOverflowMenu]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState) => ({
    products: state.pages.quickOrder.products,
    orderUploadPageLink: getPageLinkByPageType(state, "OrderUploadPage"),
    cartPageLink: getPageLinkByPageType(state, "CartPage"),
    showAddToCartConfirmationDialog: getSettingsCollection(state).productSettings.showAddToCartConfirmationDialog,
});

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addCartLines: makeHandlerChainAwaitable(addCartLines),
    clearProducts,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & HasHistory;

export interface QuickOrderActionsStyles {
    wrapper?: InjectableCss;
    buttonsHidden?: HiddenProps;
    menuHidden?: HiddenProps;
    overflowMenu?: OverflowMenuPresentationProps;
    addAllToCartButton?: ButtonPresentationProps;
    addToListButton?: ButtonPresentationProps;
    uploadOrderButton?: ButtonPresentationProps;
}

const styles: QuickOrderActionsStyles = {
    wrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
            clear: both;
            ${({ theme }: { theme: BaseTheme }) =>
            breakpointMediaQueries(theme, [css` flex-flow: column; `, css` flex-flow: column; `, null, null, null])}
        `,
    },
    overflowMenu: {
        buttonProps: {
            css: css` margin-left: 2px; `,
        },
    },
    addAllToCartButton: {
        variant: "primary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
            breakpointMediaQueries(theme, [
                css` margin-top: 10px; `,
                css` margin-top: 10px; `,
                css` margin-left: 10px; `,
                css` margin-left: 10px; `,
                css` margin-left: 10px; `,
            ])}
        `,
    },
    addToListButton: {
        variant: "tertiary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
            breakpointMediaQueries(theme, [
                css` margin-top: 10px; `,
                css` margin-top: 10px; `,
                css` margin-left: 10px; `,
                css` margin-left: 10px; `,
                css` margin-left: 10px; `,
            ])}
        `,
    },
    uploadOrderButton: {
        variant: "secondary",
    },
};

export const actionsStyles = styles;

const QuickOrderActions: FC<Props> = ({
                                          fields,
                                          products,
                                          history,
                                          orderUploadPageLink,
                                          cartPageLink,
                                          showAddToCartConfirmationDialog,
                                          setAddToListModalIsOpen,
                                          addCartLines,
                                          clearProducts,
                                      }) => {
    if (!products || products.length === 0) {
        return null;
    }

    const toasterContext = React.useContext(ToasterContext);

    const [allQtysIsValid, setAllQtysIsValid] = useState(false);

    React.useEffect(
        () => {
            const isValid = products.every(product => {
                return product.qtyOrdered && parseFloat(product.qtyOrdered.toString()) > 0;
            });
            setAllQtysIsValid(isValid);
        },
        [products],
    );

    const uploadOrderClickHandler = () => {
        orderUploadPageLink && history.push(orderUploadPageLink.url);
    };

    const addAllToCartClickHandler = async () => {
        await addCartLines({ products });
        if (showAddToCartConfirmationDialog) {
            toasterContext.addToast({ body: siteMessage("Cart_AllProductsAddedToCart"), messageType: "success" });
        }
        clearProducts();
        cartPageLink && history.push(cartPageLink.url);
    };

    const addToListClickHandler = () => {
        setAddToListModalIsOpen({ modalIsOpen: true, products });
    };

    const buttons = <>
        <Button {...styles.uploadOrderButton} onClick={uploadOrderClickHandler}>{translate("Upload Order")}</Button>
        <Button {...styles.addToListButton} onClick={addToListClickHandler} disabled={!allQtysIsValid}>{translate("Add To List")}</Button>
    </>;

    return (
        <StyledWrapper {...styles.wrapper}>
            {fields.useOverflowMenu
            && <>
                <Hidden below="lg" {...styles.buttonsHidden}>
                    {buttons}
                </Hidden>
                <Hidden above="sm" {...styles.buttonsHidden}>
                    {buttons}
                </Hidden>
            </>
            }
            {!fields.useOverflowMenu
            && buttons
            }
            <Button {...styles.addAllToCartButton} onClick={addAllToCartClickHandler} disabled={!allQtysIsValid}>
                {translate("Add All to Cart & Check Out")}
            </Button>
            {fields.useOverflowMenu
            && <Hidden below="md" above="md" {...styles.menuHidden}>
                <OverflowMenu {...styles.overflowMenu}>
                    <Clickable onClick={uploadOrderClickHandler}>{translate("Upload Order")}</Clickable>
                    <Clickable onClick={addToListClickHandler} disabled={!allQtysIsValid}>{translate("Add To List")}</Clickable>
                </OverflowMenu>
            </Hidden>
            }
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(QuickOrderActions)),
    definition: {
        group: "Quick Order",
        allowedContexts: [QuickOrderPageContext],
        displayName: "Actions",
        fieldDefinitions: [
            {
                name: fields.useOverflowMenu,
                displayName: "Use overflow menu on responsive views",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
            },
        ],
    },
};

export default widgetModule;
