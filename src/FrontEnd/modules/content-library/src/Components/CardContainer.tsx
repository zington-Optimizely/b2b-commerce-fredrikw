import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import React, { FC } from "react";
import { css } from "styled-components";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import getColor from "@insite/mobius/utilities/getColor";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";

export interface CardContainerStyles {
    cardDivider?: InjectableCss;
    gridItem?: GridItemProps;
}

export const cardContainerStyles: CardContainerStyles = {
    cardDivider: {
        css: css`
            width: 100%;
            border-top: 1px solid ${getColor("common.border")};
            &:last-child {
                border-bottom: 1px solid ${getColor("common.border")};
            }
        `,
    },
    gridItem: {
        width: 12,
    },
};

const CardContainer: FC<{
    extendedStyles?: CardContainerStyles;
}> = ({ extendedStyles, children }) => {

    const [styles] = React.useState(() => mergeToNew(cardContainerStyles, extendedStyles));

    return (
        <StyledWrapper {...styles.cardDivider}>
            <GridItem {...styles.gridItem}>
                {children}
            </GridItem>
        </StyledWrapper>
    );
};

export default CardContainer;
