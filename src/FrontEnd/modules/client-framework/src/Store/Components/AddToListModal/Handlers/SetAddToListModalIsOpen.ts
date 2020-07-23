import sleep from "@insite/client-framework/Common/Sleep";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import loadWishLists from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishLists";
import { getWishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";

type HandlerType = Handler<{ products?: ProductModelExtended[]; modalIsOpen: boolean }>;

export const wishListsParameter = {
    filter: "availableToAdd",
    pageSize: 100,
};

export const LoadLists: HandlerType = async props => {
    if (props.parameter.modalIsOpen && props.getState().context.session.isAuthenticated && !getWishListsDataView(props.getState(), wishListsParameter).value) {
        props.dispatch(loadWishLists(wishListsParameter));

        for(let x = 0; x < 200; x += 1) {
            if (getWishListsDataView(props.getState(), wishListsParameter).value) {
                break;
            }
            await sleep(50);
        }
    }
};

export const DispatchCompleteSetAddToListModalIsOpen: HandlerType = props => {
    props.dispatch({
        type: "Components/AddToListModal/CompleteSetIsOpen",
        isOpen: props.parameter.modalIsOpen,
        products: props.parameter.products,
    });
};

export const chain = [
    LoadLists,
    DispatchCompleteSetAddToListModalIsOpen,
];

const setAddToListModalIsOpen = createHandlerChainRunner(chain, "SetAddToListModalIsOpen");
export default setAddToListModalIsOpen;
