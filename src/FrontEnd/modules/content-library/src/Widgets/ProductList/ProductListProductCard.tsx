import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import { ProductCardSelections } from "@insite/content-library/Widgets/ProductList/ProductCardSelections";
import ProductListActions from "@insite/content-library/Widgets/ProductList/ProductListActions";
import ProductListProductImage from "@insite/content-library/Widgets/ProductList/ProductListProductImage";
import ProductListProductInformation from "@insite/content-library/Widgets/ProductList/ProductListProductInformation";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import React, { FC } from "react";
import { css } from "styled-components";

type Props = ProductCardSelections & HasProduct;

export interface ProductListProductCardStyles {
    gridContainer?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    rightColumnGridItem?: GridItemProps;
    rightColumnGridContainer?: GridContainerProps;
    infoGridItem?: GridItemProps;
    actionsGridItem?: GridItemProps;
}

export const productCardStyles: ProductListProductCardStyles = {
    gridContainer: {
        gap: 0,
        css: css`
            padding: 30px 0;
            min-width: 320px; /* prevent overlap with second column */
        `,
    },
    leftColumnGridItem: {
        width: [4, 4, 4, 3, 3],
        css: css` padding-right: 20px; `,
    },
    rightColumnGridItem: {
        width: [8, 8, 8, 9, 9],
    },
    infoGridItem: {
        width: [12, 12, 12, 7, 7],
    },
    actionsGridItem: {
        width: [12, 12, 12, 5, 5],
    },
};

const styles = productCardStyles;

const ProductListProductCard: FC<Props> = props => {
    return (
        <GridContainer {...styles.gridContainer} data-test-selector={`productListProductCard${props.product.id}`}>
            <GridItem {...styles.leftColumnGridItem}>
                <ProductListProductImage showImage={props.showImage} showCompare={props.showCompare} />
            </GridItem>
            <GridItem {...styles.rightColumnGridItem}>
                <GridContainer {...styles.rightColumnGridContainer}>
                    <GridItem {...styles.infoGridItem}>
                        <ProductListProductInformation
                            showBrand={props.showBrand}
                            showTitle={props.showTitle}
                            showPartNumbers={props.showPartNumbers}
                            showAvailability={props.showAvailability}
                            showAttributes={props.showAttributes} />
                    </GridItem>
                    <GridItem {...styles.actionsGridItem}>
                        <ProductListActions showPrice={props.showPrice} showAddToList={props.showAddToList}/>
                    </GridItem>
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

export default withProduct(ProductListProductCard);
