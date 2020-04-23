import { PromotionModel } from "@insite/client-framework/Types/ApiModels";
import CartLineCardCondensed, { CartLineCardCondensedStyles } from "@insite/content-library/Components/CartLineCardCondensed";
import CartLineCardExpanded, { CartLineCardExpandedStyles } from "@insite/content-library/Components/CartLineCardExpanded";
import CartLinesListHeader, { CartLinesListHeaderStyles } from "@insite/content-library/Components/CartLinesListHeader";
import { PaginationPresentationProps } from "@insite/mobius/Pagination";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React, { FC } from "react";
import { css } from "styled-components";
import { CartLineContext } from "@insite/client-framework/Components/CartLineContext";
import { Cart } from "@insite/client-framework/Services/CartService";

interface OwnProps {
    cart: Cart;
    promotions: PromotionModel[];
    isCondensed: boolean;
    onChangeIsCondensed: (event: React.SyntheticEvent<Element, Event>, value: boolean) => void;
    editable: boolean;
    showSavingsAmount: boolean;
    showSavingsPercent: boolean;
    extendedStyles?: CartLinesListStyles;
}

export interface CartLinesListStyles {
    header?: CartLinesListHeaderStyles;
    cardCondensed?: CartLineCardCondensedStyles;
    cardExpanded?: CartLineCardExpandedStyles;
    pagination?: PaginationPresentationProps;
}

export const orderLinesListStyles: CartLinesListStyles = {
    pagination: {
        cssOverrides: {
            pagination: css` @media print { display: none; } `,
        },
    },
};

const CartLinesList: FC<OwnProps> = ({
                                         cart,
                                         promotions,
                                         isCondensed,
                                         onChangeIsCondensed,
                                         editable,
                                         showSavingsAmount,
                                         showSavingsPercent,
                                         extendedStyles,
                                     }) => {
    const [styles] = React.useState(() => mergeToNew(orderLinesListStyles, extendedStyles));

    if (!cart.cartLines) {
        return null;
    }

    const CartLineComponent = isCondensed ? CartLineCardCondensed : CartLineCardExpanded;

    return (
        <>
            <CartLinesListHeader
                productsCount={cart.cartLines.length}
                isCondensed={isCondensed}
                onChangeIsCondensed={onChangeIsCondensed}
                extendedStyles={styles.header}
            />
            {cart.cartLines!.map(cartLine => {
                const cartLinePromotions = promotions!.filter(promotion => promotion.orderLineId === cartLine.id);
                return (
                    <CartLineContext.Provider value={cartLine} key={cartLine.id}>
                        <CartLineComponent
                            cart={cart}
                            promotions={cartLinePromotions}
                            editable={editable}
                            showSavingsAmount={showSavingsAmount}
                            showSavingsPercent={showSavingsPercent}
                        />
                    </CartLineContext.Provider>
                );
            })}
        </>
    );
};

export default CartLinesList;
