import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React, { FC, useState } from "react";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";

export interface CardListStyles {
    gridContainer?: GridContainerProps;
}

export const cardListStyles: CardListStyles = {
    gridContainer: {
        gap: 40,
    },
};

const CardList: FC<{
    extendedStyles?: CardListStyles;
}> = ({ extendedStyles, children, ...otherProps }) => {

    const [styles] = useState(() => mergeToNew(cardListStyles, extendedStyles));

    return (
        <GridContainer {...styles.gridContainer} {...otherProps}>
            {children}
        </GridContainer>
    );
};

export default CardList;
