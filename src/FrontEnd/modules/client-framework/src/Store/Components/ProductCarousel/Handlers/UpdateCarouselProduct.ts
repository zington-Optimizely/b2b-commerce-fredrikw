import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";

export interface UpdateCarouselProductParameter {
    carouselId: string;
    product: ProductModelExtended;
}

type HandlerType = Handler<UpdateCarouselProductParameter>;

export const DispatchUpdateCarouselProduct: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductCarousel/UpdateCarouselProduct",
        carouselId: props.parameter.carouselId,
        product: props.parameter.product,
    });
};

export const chain = [
    DispatchUpdateCarouselProduct,
];

const updateCarouselProduct = createHandlerChainRunner(chain, "UpdateCarouselProduct");

export default updateCarouselProduct;
