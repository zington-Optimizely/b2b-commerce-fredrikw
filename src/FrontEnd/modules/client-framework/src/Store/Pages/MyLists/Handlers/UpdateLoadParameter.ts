import { GetWishListsApiParameter } from "@insite/client-framework/Services/WishListService";
import { Handler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<GetWishListsApiParameter>;

export const DispatchUpdateLoadParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyLists/UpdateLoadParameter",
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchUpdateLoadParameter,
];

const updateLoadParameter = createHandlerChainRunner(chain, "UpdateLoadParameter");
export default updateLoadParameter;
