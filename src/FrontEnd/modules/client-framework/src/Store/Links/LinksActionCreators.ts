import AppThunkAction from "@insite/client-framework/Common/AppThunkAction";
import { addTask } from "@insite/client-framework/ServerSideRendering";
import { getPageLinks } from "@insite/client-framework/Services/ContentService";

export const loadPageLinks = (): AppThunkAction => dispatch => {
    addTask(async function () {
        dispatch({
            type: "Links/BeginLoadPageLinks",
        });

        const result = await getPageLinks();

        dispatch({
            pageLinks: result,
            type: "Links/CompleteLoadPageLinks",
        });
    }());
};
