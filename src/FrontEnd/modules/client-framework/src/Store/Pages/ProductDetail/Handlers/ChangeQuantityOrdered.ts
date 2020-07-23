import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ qtyOrdered: number; }>;

export const DispatchChangeQuantityOrdered: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetail/ChangeQuantityOrdered",
        qtyOrdered: props.parameter.qtyOrdered,
    });
};

export const chain = [
    DispatchChangeQuantityOrdered,
];

const changeQuantityOrdered = createHandlerChainRunner(chain, "ChangeQuantityOrdered");
export default changeQuantityOrdered;
