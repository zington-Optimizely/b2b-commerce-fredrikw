import { get, HasPagingParameters, post, ApiParameter } from "@insite/client-framework/Services/ApiService";
import {
    AvailabilityDto,
    CatalogPageModel,
    InventoryAvailabilityDto,
    ProductCollectionModel,
    ProductModel,
    ProductPriceDto,
    RealTimeInventoryModel,
    RealTimePricingModel,
} from "@insite/client-framework/Types/ApiModels";

const catalogPagesUrl = "/api/v1/catalogpages";
const realTimePricingUrl = "/api/v1/realtimepricing";
const realTimeInventoryUrl = "/api/v1/realtimeinventory";
const productsUrl = "/api/v2/products";

export interface GetProductApiV2ParameterBase extends ApiParameter {
    expand?: ("detail" | "content" | "images" | "documents" | "specifications" | "properties" | "attributes" | "variantTraits" | "facets" | "warehouses")[];
    additionalExpands?: string[];
    includeAttributes?: ("includeOnProduct" | "comparable" | "facets")[];
}

type ProductFilterTokens = "frequentlyPurchased" | "recentlyPurchased" | "alsoPurchased" | "recentlyViewed" | "topSellers" | "siteCrosssells";

export interface GetProductsApiV2Parameter extends GetProductApiV2ParameterBase, HasPagingParameters {
    search?: string;
    categoryId?: string;
    productIds?: string[],
    names?: string[],
    searchWithin?: string;
    brandIds?: string[];
    makeBrandUrls?: boolean;
    productLineIds?: string[];
    attributeValueIds?: string[];
    priceFilters?: string[];
    filter?: ProductFilterTokens;
    topSellersCategoryIds?: string[];
    topSellersPersonaIds?: string[];
    topSellersMaxResults?: number;
    includeSuggestions?: boolean;
    applyPersonalization?: boolean;
    cartId?: string;
    extendedNames?: string[];
}

export interface GetProductByPathApiV2Parameter extends GetProductApiV2ParameterBase {
    path: string;
    styledOption?: string;
}

export interface GetProductByIdApiV2Parameter extends GetProductApiV2ParameterBase {
    id: string;
    unitOfMeasure?: string;
    alsoPurchasedMaxResults?: number;
}

export interface GetProductRealTimePriceApiV2Parameter extends ApiParameter {
    product: ProductModelExtended;
    configuration?: string[];
}

export interface GetProductsRealTimePriceApiV2Parameter extends ApiParameter {
    products: ProductModelExtended[];
}

export interface GetProductRealTimeInventoryApiV2Parameter extends  ApiParameter {
    productId: string;
    unitOfMeasure: string;
    configuration?: string[];
    expand?: ("warehouses")[];
}

export interface GetProductsRealTimeInventoryApiV2Parameter extends ApiParameter {
    products: ProductModelExtended[];
    configurations?: { [productId: string]: string[] };
    expand?: string[];
}

export interface RealTimePricingParameter {
    productPriceParameters: {
        productId: string;
        unitOfMeasure: string;
        qtyOrdered: number;
        configuration?: string[],
    }[],
}

export interface RealTimeInventoryParameter {
    productIds: string[];
    configuration?: { [productId: string]: string[] },
    expand?: string[];
}

export interface GetProductVariantChildrenApiV2Parameter extends GetProductApiV2ParameterBase, HasPagingParameters {
    productId: string;
}

export interface GetProductVariantChildApiV2Parameter extends GetProductApiV2ParameterBase {
    variantParentId: string;
    variantId: string;
}

export interface ProductModelExtended extends ProductModel {
    pricing?: ProductPriceDto;
    failedToLoadPricing?: true;
    availability?: AvailabilityDto;
    inventoryAvailabilities?: InventoryAvailabilityDto[];
    selectedUnitOfMeasure: string;
    unitOfMeasure: string;
    unitOfMeasureDescription: string;
    unitOfMeasureDisplay: string;
    qtyOrdered: number;
    qtyOnHand?: number;
    productDetailPath: string;
}

export interface ProductCollectionModelExtended extends ProductCollectionModel {
    products: ProductModelExtended[] | null;
}

export enum ConfigurationType {
    None = "None",
    Standard = "Standard",
    Fixed = "Fixed",
    Advanced = "Advanced",
}

const convertProductModel = (productModel: ProductModel) => {
    const defaultUnitOfMeasure = productModel.unitOfMeasures?.find(o => o.isDefault);
    return {
        ...productModel,
        unitOfMeasure: defaultUnitOfMeasure?.unitOfMeasure,
        selectedUnitOfMeasure: defaultUnitOfMeasure?.unitOfMeasure,
        unitOfMeasureDescription: defaultUnitOfMeasure?.description,
        unitOfMeasureDisplay: defaultUnitOfMeasure?.unitOfMeasureDisplay,
    } as ProductModelExtended;
};

export async function getProductCollectionV2(parameter: GetProductsApiV2Parameter) {
    const productModelCollection = await get<ProductCollectionModelExtended>(productsUrl, parameter);
    productModelCollection.products = productModelCollection.products?.map(p => convertProductModel(p)) || null;
    return productModelCollection;
}

interface GetRelatedProductCollectionApiV2Parameter extends GetProductApiV2ParameterBase, HasPagingParameters {
    productId: string;
    relationship: string;
}

export async function getRelatedProductsCollectionV2(parameter: GetRelatedProductCollectionApiV2Parameter) {
    const productId = parameter.productId;
    delete parameter.productId;
    const productModelCollection =  await get<ProductCollectionModelExtended>(
        `${productsUrl}/${productId}/relatedproducts`,
        parameter,
    );
    productModelCollection.products = productModelCollection.products?.map(p => convertProductModel(p)) || null;
    return productModelCollection;
}

export function getProductRealTimePrice(parameter: GetProductRealTimePriceApiV2Parameter) {
    return post<RealTimePricingParameter, RealTimePricingModel>(`${realTimePricingUrl}`, {
        productPriceParameters: [
            {
                productId: parameter.product.id,
                unitOfMeasure: parameter.product.selectedUnitOfMeasure,
                qtyOrdered: parameter.product.qtyOrdered,
                configuration: parameter.configuration,
            },
        ],
    });
}

export function getProductCollectionRealTimePrices(parameter: GetProductsRealTimePriceApiV2Parameter) {
    return post<RealTimePricingParameter, RealTimePricingModel>(`${realTimePricingUrl}`, {
        productPriceParameters: parameter.products.map(p => ({
                productId: p.id,
                unitOfMeasure: p.selectedUnitOfMeasure,
                qtyOrdered: p.qtyOrdered,
                configuration: [],
            }),
        ),
    });
}

export function getProductRealTimeInventory(parameter: GetProductRealTimeInventoryApiV2Parameter) {
    let url = realTimeInventoryUrl;
    if (parameter.expand) {
        url += (`?expand=${parameter.expand.join(",")}`);
    }

    return post<RealTimeInventoryParameter, RealTimeInventoryModel>(`${url}`, {
        productIds: [parameter.productId],
        configuration: parameter.configuration ? { [parameter.productId]: parameter.configuration } : undefined,
    });
}

export function getProductCollectionRealTimeInventory(parameter: GetProductsRealTimeInventoryApiV2Parameter) {
    let url = realTimeInventoryUrl;
    if (parameter.expand) {
        url += (`?expand=${parameter.expand.join(",")}`);
    }

    return post<RealTimeInventoryParameter, RealTimeInventoryModel>(`${url}`, {
        productIds: parameter.products.map(p => p.id),
        configuration: parameter.configurations,
    });
}

export async function getProductByPath(parameter: GetProductByPathApiV2Parameter) {
    const result = await get<CatalogPageModel>(`${catalogPagesUrl}`, { path: parameter.path } as ApiParameter);
    const productModel = await get<ProductModelExtended>(`${productsUrl}/${result.productId}`, {
        expand: parameter.expand,
        additionalExpands: parameter.additionalExpands,
        includeAttributes: parameter.includeAttributes,
    } as ApiParameter);

    return convertProductModel(productModel);
}

export async function getProductById(parameter: GetProductByIdApiV2Parameter) {
    const productModel = await get<ProductModel>(`${productsUrl}/${parameter.id}`, {
        expand: parameter.expand,
        additionalExpands: parameter.additionalExpands,
        unitOfMeasure: parameter.unitOfMeasure,
        includeAttributes: parameter.includeAttributes,
        alsoPurchasedMaxResults: parameter.alsoPurchasedMaxResults,
    } as ApiParameter);

    return convertProductModel(productModel);
}

export async function getVariantChildren(parameter: GetProductVariantChildrenApiV2Parameter) {
    const variantchildren = await get<ProductCollectionModelExtended>(`${productsUrl}/${parameter.productId}/variantchildren`, {});
    variantchildren.products = variantchildren.products?.map(p => convertProductModel(p)) || null;
    return variantchildren;
}

export async function getVariantChild(parameter: GetProductVariantChildApiV2Parameter) {
    const variantChild = await get<ProductModelExtended>(`${productsUrl}/${parameter.variantParentId}/variantchildren/${parameter.variantId}`, {});
    return convertProductModel(variantChild);
}
