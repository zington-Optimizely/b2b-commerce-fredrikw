/* eslint-disable spire/export-styles */
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import ProductAvailability, { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import React from "react";

interface OwnProps {
    isProductDetailsPage?: boolean;
    extendedStyles?: ProductAvailabilityStyles;
}

const ProductContextAvailability = ({ productInfo, product, isProductDetailsPage, extendedStyles }: HasProduct & OwnProps) => {
    const { inventory, unitOfMeasure } = productInfo;

    const availability = inventory?.inventoryAvailabilityDtos
        ?.find(o => o.unitOfMeasure.toLowerCase() === (unitOfMeasure?.toLowerCase() || ""))?.availability || undefined;

    return <ProductAvailability
        productId={product.id}
        trackInventory={product.trackInventory}
        availability={availability}
        unitOfMeasure={unitOfMeasure}
        isProductDetailsPage={isProductDetailsPage}
        extendedStyles={extendedStyles}
    />;
};

export default withProduct(ProductContextAvailability);
