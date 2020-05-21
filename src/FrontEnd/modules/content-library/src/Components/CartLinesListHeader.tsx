import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React, { FC } from "react";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import { css } from "styled-components";
import getColor from "@insite/mobius/utilities/getColor";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import translate from "@insite/client-framework/Translate";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";

export interface CartLinesListHeaderStyles {
    wrapper?: InjectableCss;
    productCountText?: TypographyPresentationProps;
    checkboxGroup?: FieldSetGroupPresentationProps<CheckboxGroupComponentProps>;
    condensedCheckbox?: CheckboxPresentationProps;
}

export const cartLinesListHeaderStyles: CartLinesListHeaderStyles = {
    wrapper: {
        css: css`
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid ${getColor("common.border")};
            padding-bottom: 10px;
        `,
    },
    productCountText: { weight: 600 },
    checkboxGroup: {
        css: css` @media print { display: none; } `,
    },
};

const CartLinesListHeader: FC<{
    productsCount: number;
    isCondensed: boolean;
    onChangeIsCondensed: (event: React.SyntheticEvent, value: boolean) => void;
    extendedStyles?: CartLinesListHeaderStyles;
}> = ({
    productsCount,
    onChangeIsCondensed,
    extendedStyles,
    isCondensed,
}) => {
    const [styles] = React.useState(() => mergeToNew(cartLinesListHeaderStyles, extendedStyles));

    const productsLabel = productsCount > 1 ? "Products" : "Product";

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.productCountText}>{productsCount} {translate(productsLabel)}</Typography>
            <CheckboxGroup {...styles.checkboxGroup}>
                <Checkbox
                    {...styles.condensedCheckbox}
                    checked={isCondensed}
                    onChange={onChangeIsCondensed}
                >
                    {translate("Condensed View")}
                </Checkbox>
            </CheckboxGroup>
        </StyledWrapper>
    );
};

export default CartLinesListHeader;
