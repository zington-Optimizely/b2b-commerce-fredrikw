import { Handler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";

type HandlerType = Handler<{
    isSubscribed?: boolean;
    billToId?: string;
    shipToId?: string;
    useDefaultCustomer?: boolean;
    email?: string;
    fulfillmentMethod?: string;
}, {
    emailErrorMessage?: string;
}>;

const emailRegexp = new RegExp("\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");

const requiredFieldMessage = siteMessage("Field_Required", translate("Email Address"));
const emailFieldMessage = siteMessage("Field_Invalid", translate("Email Address"));

export const ValidateEmail: HandlerType = props => {
    const { parameter: { email } } = props;
    if (typeof email === "undefined") {
        return;
    }

    const errorMessage = email === "" ? requiredFieldMessage : (emailRegexp.test(email) ? "" : emailFieldMessage);
    props.emailErrorMessage = errorMessage as string;
};

export const DispatchUpdateAccountSettings: HandlerType = props => {
    props.dispatch({
        ...props.parameter,
        emailErrorMessage: props.emailErrorMessage,
        type: "Pages/AccountSettings/UpdateAccountSettings",
    });
};

export const chain = [
    ValidateEmail,
    DispatchUpdateAccountSettings,
];

const updateAccountSettings = createHandlerChainRunner(chain, "UpdateAccountSettings");
export default updateAccountSettings;
