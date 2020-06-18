import { updateContext } from "@insite/client-framework/Context";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { getSession, Session, updateSession, UpdateSessionApiParameter } from "@insite/client-framework/Services/SessionService";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{
    billToId: string;
    shipToId: string;
    fulfillmentMethod: string;
    pickUpWarehouse: WarehouseModel | null;
} & HasOnSuccess, UpdateSessionApiParameter, Session>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        session: {
            customerWasUpdated: false,
            shipToId: props.parameter.shipToId,
            billToId: props.parameter.billToId,
            fulfillmentMethod: props.parameter.fulfillmentMethod,
            pickUpWarehouse: props.parameter.fulfillmentMethod === "PickUp" ? props.parameter.pickUpWarehouse : null,
        },
    };
};

/**
 * Since the chain will not force a reload of the page, the chain should get an updated session.
 */
export const UpdateSession: HandlerType = async props => {
    await updateSession(props.apiParameter);
    props.apiResult = await getSession({});
};

export const UpdateContext: HandlerType = props => {
    updateContext({
        shipToId: props.parameter.shipToId,
        billToId: props.parameter.billToId,
    });
};

/**
 * We need to make sure we correctly update the session with the new shipToId and billToId.
 * Since the server will not correctly send the shipToId in the API request.
 * The ShipTo will update after a full request with the BillToIdShipToId cookie is able to be processed.
 */
export const DispatchCompleteLoadSession: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadSession",
        session: {
            ...props.apiResult,
            shipToId: props.parameter.shipToId,
            billToId: props.parameter.billToId,
        },
    });
};

export const ResetBillTosAndShipTosData: HandlerType = props => {
    props.dispatch({
        type: "Data/BillTos/Reset",
    });
    props.dispatch({
        type: "Data/ShipTos/Reset",
    });
    props.dispatch({
        type: "Data/Carts/Reset",
    });
    props.dispatch({
        type: "Data/Orders/Reset",
    });
};

export const chain = [
    PopulateApiParameter,
    UpdateSession,
    UpdateContext,
    DispatchCompleteLoadSession,
    ResetBillTosAndShipTosData,
];

const changeCustomerContext = createHandlerChainRunner(chain, "ChangeCustomerContext");
export default changeCustomerContext;
