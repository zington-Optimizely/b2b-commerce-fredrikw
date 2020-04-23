import React, { FC } from "react";
import { connect } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductAvailability, { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductAttributes, { ProductAttributesStyles } from "@insite/content-library/Components/ProductAttributes";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import { css } from "styled-components";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

interface OwnProps extends HasProductContext {
    showBrand: boolean;
    showTitle: boolean;
    showPartNumbers: boolean;
    showAvailability: boolean;
    showAttributes: boolean;
}

const mapStateToProps = (state: ApplicationState) => ({
    settingsCollection: getSettingsCollection(state),
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

export interface ProductListProductInformationStyles {
    container?: GridContainerProps;
    brandStyles?: ProductBrandStyles;
    descriptionStyles?: ProductDescriptionStyles;
    brandGridItem?: GridItemProps;
    descriptionGridItem?: GridItemProps;
    partNumbersGridItem?: GridItemProps;
    partNumbersStyles?: ProductPartNumbersStyles;
    availabilityGridItem?: GridItemProps;
    availabilityStyles?: ProductAvailabilityStyles;
    attributesGridItem?: GridItemProps;
    attributes?: ProductAttributesStyles;
}

const styles: ProductListProductInformationStyles = {
    container: {
        gap: 10,
        css: css` width: 100%; `,
    },
    descriptionStyles: {
        productDetailLink: {
            css: css` width: 100%; `,
            typographyProps: {
                size: 20,
            },
        },
    },
    brandGridItem: {
        width: 12,
    },
    descriptionGridItem: {
        width: 12,
    },
    partNumbersGridItem: {
        width: 12,
    },
    availabilityGridItem: {
        width: 12,
    },
    attributesGridItem: {
        width: 12,
    },
};

export const productInformationStyles = styles;

const ProductListProductInformation: FC<Props> = ({
    product,
    settingsCollection,
    showBrand,
    showTitle,
    showPartNumbers,
    showAvailability,
    showAttributes }) => {

    if (!product) {
        return null;
    }

    return (
        <GridContainer {...styles.container}>
            {product.brand && showBrand
                && <GridItem {...styles.brandGridItem}>
                    <ProductBrand brand={product.brand} extendedStyles={styles.brandStyles}/>
                </GridItem>
            }
            {showTitle
                && <GridItem {...styles.descriptionGridItem}>
                    <ProductDescription product={product} extendedStyles={styles.descriptionStyles}/>
                </GridItem>
            }
            {showPartNumbers
                && <GridItem {...styles.partNumbersGridItem}>
                    <ProductPartNumbers
                        productNumber={product.productNumber}
                        customerProductNumber={product.customerProductNumber}
                        manufacturerItem={product.manufacturerItem}
                        extendedStyles={styles.partNumbersStyles}
                    />
                </GridItem>
            }
            {settingsCollection.productSettings.showInventoryAvailability && showAvailability
                && <GridItem {...styles.availabilityGridItem}>
                    <ProductAvailability
                        productId={product.id}
                        availability={product.availability!}
                        unitOfMeasure={product.unitOfMeasure}
                        trackInventory={product.trackInventory}
                        extendedStyles={styles.availabilityStyles}
                    />
                </GridItem>
            }
            {showAttributes
                && <GridItem {...styles.attributesGridItem}>
                    <ProductAttributes product={product} maximumNumberAttributeTypes={3}
                                       extendedStyles={styles.attributes}/>
                </GridItem>
            }
        </GridContainer>
    );
};

export default connect(mapStateToProps)(withProduct(ProductListProductInformation));
