import { updateContext } from "@insite/client-framework/Context";
import {
    ApiHandlerNoApiParameter,
    createHandlerChainRunner,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import { createShipTo, updateShipTo as updateShipToApi } from "@insite/client-framework/Services/CustomersService";
import { updateSession } from "@insite/client-framework/Services/SessionService";
import loadCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCart";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTo";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerNoApiParameter<
    {
        billToId: string;
        shipTo: ShipToModel;
    },
    ShipToModel
>;

export const AddOrUpdateShipTo: HandlerType = async props => {
    if (props.parameter.shipTo.isNew) {
        props.apiResult = await createShipTo({
            shipTo: props.parameter.shipTo,
        });
    } else {
        props.apiResult = await updateShipToApi({
            billToId: props.parameter.billToId,
            shipTo: props.parameter.shipTo,
        });
    }

    // reload to make sure we get validation
    await makeHandlerChainAwaitable(loadShipTo)({
        billToId: props.parameter.billToId,
        shipToId: props.apiResult.id,
    })(props.dispatch, props.getState);
};

export const UpdateContext: HandlerType = props => {
    if (props.apiResult) {
        updateContext({
            billToId: props.parameter.billToId,
            shipToId: props.apiResult.id,
        });
    }
};

export const UpdateSession: HandlerType = async props => {
    if (props.apiResult) {
        await updateSession({
            session: {
                billToId: props.parameter.billToId,
                shipToId: props.apiResult.id,
                customerWasUpdated: true,
            },
        });
    }
};

export const LoadCart: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    if (cartId) {
        props.dispatch(loadCart({ cartId }));
    } else {
        props.dispatch(loadCurrentCart());
    }
};

export const DispatchCompleteUpdateShipTo: HandlerType = props => {
    const shipToState = getShipToState(props.getState(), props.apiResult.id);

    props.dispatch({
        type: "Pages/CheckoutShipping/CompleteUpdateShipTo",
        shipTo: shipToState.value!,
    });
};

export const DispatchSetLastSelectedShipTo: HandlerType = props => {
    const state = props.getState();
    const {
        pages: {
            checkoutShipping: { useOneTimeAddress },
        },
    } = state;
    if (useOneTimeAddress) {
        return;
    }

    const shipToState = getShipToState(state, props.apiResult.id);

    props.dispatch({
        type: "Pages/CheckoutShipping/SetLastSelectedShipTo",
        shipTo: shipToState.value!,
    });
};

const chain = [
    AddOrUpdateShipTo,
    UpdateContext,
    UpdateSession,
    LoadCart,
    DispatchCompleteUpdateShipTo,
    DispatchSetLastSelectedShipTo,
];

const updateShipTo = createHandlerChainRunner(chain, "UpdateShipTo");
export default updateShipTo;
