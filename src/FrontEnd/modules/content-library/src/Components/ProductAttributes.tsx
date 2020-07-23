import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { css } from "styled-components";

interface OwnProps {
    product: ProductModelExtended;
    maximumNumberAttributeTypes: number;
    extendedStyles?: ProductAttributesStyles;
}

type Props = OwnProps;

export interface ProductAttributesStyles {
    container?: GridContainerProps;
    attributeTypeGridItem?: GridItemProps;
    attributeValueGridItem?: GridItemProps;
    attributeTypeText?: TypographyPresentationProps;
    attributeValueText?: TypographyPresentationProps;
}

export const productAttributesStyles: ProductAttributesStyles = {
    container: {
        gap: 0,
    },
    attributeTypeGridItem: {
        width: [6, 6, 6, 4, 4],
        css: css` overflow: hidden; `,
    },
    attributeValueGridItem: {
        width: [6, 6, 6, 8, 8],
        css: css` overflow: hidden; `,
    },
    attributeTypeText: {
        weight: "bold",
    },
};

const ProductAttributes: FC<Props> = ({
                                          product,
                                          maximumNumberAttributeTypes,
                                          extendedStyles,
                                 }) => {
    const [styles] = React.useState(() => mergeToNew(productAttributesStyles, extendedStyles));

    if (!product.attributeTypes || product.attributeTypes.length === 0) {
        return null;
    }

    const maximum = Math.min(maximumNumberAttributeTypes, 100);

    return (
        <GridContainer {...styles.container}>
            {product.attributeTypes.slice(0, maximum).map(attributeType =>
                <React.Fragment key={attributeType.id.toString()}>
                    <GridItem {...styles.attributeTypeGridItem}>
                        <Typography {...styles.attributeTypeText} data-test-selector={`attributeType${attributeType.id}`}>
                            {attributeType.label}
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.attributeValueGridItem} data-test-selector={`attributeValuesFor${attributeType.id}`}>
                        <Typography {...styles.attributeValueText}>
                            {attributeType.attributeValues?.map(a => a.valueDisplay).join(", ")}
                        </Typography>
                    </GridItem>
                </React.Fragment>,
            )}
        </GridContainer>
    );
};

export default ProductAttributes;
