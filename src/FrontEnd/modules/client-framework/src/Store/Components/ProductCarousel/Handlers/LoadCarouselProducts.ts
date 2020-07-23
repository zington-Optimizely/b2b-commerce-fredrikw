import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import {
    getProductCollectionV2,
    getRelatedProductsCollectionV2,
    ProductModelExtended,
} from "@insite/client-framework/Services/ProductServiceV2";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { BrandModel, CategoryModel } from "@insite/client-framework/Types/ApiModels";

export interface LoadCarouselProductsParameter {
    carouselId: string;
    carouselType: string;
    relatedProductType: string;
    seedWithManuallyAssigned: string;
    displayProductsFrom: string;
    selectedCategoryIds: string[];
    numberOfProductsToDisplay: number;
    isProductDetailsPage: boolean;
    parentProduct?: ProductModelExtended;
    isProductListPage: boolean;
    category?: CategoryModel;
    isBrandDetailsPage: boolean;
    brand?: BrandModel;
}

export interface LoadCarouselProductsResult {
    products: ProductModelExtended[];
}

type HandlerType = HandlerWithResult<LoadCarouselProductsParameter, LoadCarouselProductsResult>;

export const DispatchBeginLoadCarouselProducts: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductCarousel/BeginLoadCarouselProducts",
        carouselId: props.parameter.carouselId,
    });
};

export const InitializeResult: HandlerType = props => {
    props.result = { products: [] };
};

export const LoadRecentlyViewed: HandlerType = async ({
    parameter: { carouselType, isProductDetailsPage, parentProduct },
    result,
}) => {
    if (carouselType !== "recentlyViewed") {
        return;
    }

    if (isProductDetailsPage && !parentProduct) {
        return;
    }

    const productCollection = await getProductCollectionV2({ filter: "recentlyViewed" });
    result.products = productCollection.products || [];
};

export const LoadCrossSells: HandlerType = async ({
    parameter: { carouselType, numberOfProductsToDisplay },
    result,
}) => {
    if (carouselType !== "crossSells") {
        return;
    }

    const productCollection = await getProductCollectionV2({ filter: "siteCrosssells", pageSize: numberOfProductsToDisplay });
    result.products = productCollection.products || [];
};

export const LoadRelatedProducts: HandlerType = async ({
    parameter: { carouselType, relatedProductType, parentProduct },
    result,
}) => {
    if (carouselType !== "relatedProducts" || !parentProduct || !relatedProductType) {
        return;
    }

    const productCollection = await getRelatedProductsCollectionV2({ productId: parentProduct.id, relationship: relatedProductType });
    result.products = productCollection.products || [];
};

export const LoadCustomersAlsoPurchased: HandlerType = async ({
    parameter: { carouselType, numberOfProductsToDisplay, seedWithManuallyAssigned, isProductDetailsPage, parentProduct },
    result,
    getState,
}) => {
    if (carouselType !== "customersAlsoPurchased") {
        return;
    }

    if (getSettingsCollection(getState()).websiteSettings.enableDynamicRecommendations) {
        return;
    }

    if (isProductDetailsPage) {
        if (!parentProduct) {
            return;
        }

        const alsoPurchasedProductsCollection = await getRelatedProductsCollectionV2({
            productId: parentProduct.id,
            pageSize: numberOfProductsToDisplay,
            relationship: "alsoPurchased",
        });

        const alsoPurchasedProducts = alsoPurchasedProductsCollection.products || [];

        if (seedWithManuallyAssigned && alsoPurchasedProducts.length < numberOfProductsToDisplay) {
            const relatedProductsCollection =  await getRelatedProductsCollectionV2({
                productId: parentProduct.id,
                pageSize: numberOfProductsToDisplay,
                relationship: seedWithManuallyAssigned,
            });

            relatedProductsCollection.products?.forEach(o => {
                    if (alsoPurchasedProducts.length < numberOfProductsToDisplay
                        && alsoPurchasedProducts.every(p => p.id !== o.id)) {
                        alsoPurchasedProducts.push(o);
                    }
                });
        }

        result.products = alsoPurchasedProducts;
    } else {
        const alsoPurchasedProductsCollection = await getProductCollectionV2({
            cartId: API_URL_CURRENT_FRAGMENT,
            pageSize: numberOfProductsToDisplay,
            filter: "alsoPurchased",
        });

        result.products = alsoPurchasedProductsCollection.products || [];
    }
};

export const LoadTopSellers: HandlerType = async ({
    parameter: { carouselType, numberOfProductsToDisplay, displayProductsFrom, selectedCategoryIds, isProductListPage, category, isBrandDetailsPage, brand },
    result,
    getState,
}) => {
    if (carouselType !== "topSellers") {
        return;
    }

    const state = getState();
    if (!getSettingsCollection(state).websiteSettings.enableDynamicRecommendations) {
        return;
    }

    const brandIds = isBrandDetailsPage && brand ? [brand.id] : [];

    let topSellersCategoryIds: string[] | undefined;
    let topSellersPersonaIds: string[] | undefined;
    if (displayProductsFrom === "allCategories") {
        topSellersCategoryIds = isProductListPage && category
            ? [category.id]
            : undefined;
    } else if (displayProductsFrom === "selectedCategories") {
        topSellersCategoryIds = selectedCategoryIds || [];
    } else if (displayProductsFrom === "customerSegments") {
        topSellersPersonaIds = state.context.session.personas?.map(o => o.id);
    }

    if (isProductListPage && (!topSellersCategoryIds || topSellersCategoryIds.length === 0) && brandIds.length === 0) {
        return;
    }

    const productCollection = await getProductCollectionV2({
        topSellersCategoryIds,
        topSellersPersonaIds,
        topSellersMaxResults: numberOfProductsToDisplay,
        brandIds,
        makeBrandUrls: brandIds.length > 0,
        filter: "topSellers",
    });
    result.products = productCollection.products || [];
};

export const LoadFeaturedCategory: HandlerType = async ({
    parameter: { carouselType, isProductListPage, category },
    result,
}) => {
    if (carouselType !== "featuredCategory") {
        return;
    }

    if (!isProductListPage || !category) {
        return;
    }

    const productCollection = await getProductCollectionV2({ categoryId: category.id, pageSize: 3 });
    result.products = productCollection.products || [];
};

export const ExcludeParentProduct: HandlerType = ({
    parameter: { isProductDetailsPage, parentProduct },
    result,
}) => {
    if (!isProductDetailsPage || !parentProduct) {
        return;
    }

    result.products = result.products.filter(product => product.id !== parentProduct.id);
};

export const DispatchCompleteLoadCarouselProducts: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductCarousel/CompleteLoadCarouselProducts",
        carouselId: props.parameter.carouselId,
        products: props.result.products,
    });
};

export const LoadRealTimePrices: HandlerType = props => {
    if (props.result.products?.length) {
        props.dispatch(loadRealTimePricing({
            parameter: { products: props.result.products },
            onSuccess: (realTimePricing) => {
                props.dispatch({
                    type: "Components/ProductCarousel/CompleteLoadRealTimePricing",
                    carouselId: props.parameter.carouselId,
                    realTimePricing,
                });
            },
            onError: () => {
                props.dispatch({
                    type: "Components/ProductCarousel/FailedLoadRealTimePricing",
                    carouselId: props.parameter.carouselId,
                });
            },
        }));
    }
};

export const LoadRealTimeInventory: HandlerType = props => {
    if (props.result.products?.length) {
        props.dispatch(loadRealTimeInventory({
            parameter: { products: props.result.products },
            onSuccess: realTimeInventory => {
                props.dispatch({
                    type: "Components/ProductCarousel/CompleteLoadRealTimeInventory",
                    carouselId: props.parameter.carouselId,
                    realTimeInventory,
                });
            },
        }));
    }
};

export const chain = [
    DispatchBeginLoadCarouselProducts,
    InitializeResult,
    LoadRecentlyViewed,
    LoadCrossSells,
    LoadRelatedProducts,
    LoadCustomersAlsoPurchased,
    LoadTopSellers,
    LoadFeaturedCategory,
    ExcludeParentProduct,
    DispatchCompleteLoadCarouselProducts,
    LoadRealTimePrices,
    LoadRealTimeInventory,
];

const loadCarouselProducts = createHandlerChainRunner(chain, "LoadCarouselProducts");

export default loadCarouselProducts;
