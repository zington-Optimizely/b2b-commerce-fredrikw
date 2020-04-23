import loadPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadPromotions";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";

const currentPromotionsParameter = Object.freeze({
    cartId: API_URL_CURRENT_FRAGMENT,
});

const loadCurrentPromotions = () => loadPromotions(currentPromotionsParameter);
export default loadCurrentPromotions;
