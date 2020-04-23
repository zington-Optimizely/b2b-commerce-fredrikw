import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { Handler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<GetShipTosApiParameter>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/Addresses/UpdateSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchUpdateSearchFields,
];

const updateSearchFields = createHandlerChainRunner(chain, "UpdateSearchFields");
export default updateSearchFields;
