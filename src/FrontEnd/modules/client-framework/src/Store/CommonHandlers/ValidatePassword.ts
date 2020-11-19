import { createHandlerChainRunnerForOldOnComplete, Handler } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";

const digitRegExp = /[0-9]/;
const lowerRegExp = /[a-z]/;
const upperRegExp = /[A-Z]/;
const specialRegExp = /\W/;

export const numberPasswordLengthMessage = translate("Password must include at least one number");
export const lowerCasePasswordLengthMessage = translate("Password must include at least one lowercase character");
export const upperCasePasswordLengthMessage = translate("Password must include at least one uppercase character");
export const specialPasswordLengthMessage = translate("Password must include at least one non alphanumeric character");

type HandlerType = Handler<
    {
        password: string;
        /** This is a legacy onComplete, it will only fire if the Handler CallOnComplete is hit */
        onComplete: (errorMessage: React.ReactNode) => void;
    },
    {
        passwordErrorMessage: React.ReactNode;
    }
>;

export const ValidatePassword: HandlerType = props => {
    let errorMessage: React.ReactNode = "";
    const passwordRequiredFieldMessage = siteMessage("CreateNewAccountInfo_Password_Required");
    const password = props.parameter.password;
    const settings = getSettingsCollection(props.getState()).accountSettings;
    const minimumPasswordLengthMessage = translate("Password must be at least {0} characters long").replace(
        "{0}",
        settings.passwordMinimumLength.toString(),
    );

    if (!password) {
        errorMessage = passwordRequiredFieldMessage;
    }

    if (!errorMessage && password.length > 0 && password.length < settings.passwordMinimumLength) {
        errorMessage = minimumPasswordLengthMessage;
    }

    if (!errorMessage && settings.passwordRequiresDigit && !digitRegExp.test(password)) {
        errorMessage = numberPasswordLengthMessage;
    }

    if (!errorMessage && settings.passwordRequiresLowercase && !lowerRegExp.test(password)) {
        errorMessage = lowerCasePasswordLengthMessage;
    }

    if (!errorMessage && settings.passwordRequiresUppercase && !upperRegExp.test(password)) {
        errorMessage = upperCasePasswordLengthMessage;
    }

    if (!errorMessage && settings.passwordRequiresSpecialCharacter && !specialRegExp.test(password)) {
        errorMessage = specialPasswordLengthMessage;
    }

    props.passwordErrorMessage = errorMessage;
};

export const CallOnComplete: HandlerType = props => {
    props.parameter.onComplete(props.passwordErrorMessage);
};

export const chain = [ValidatePassword, CallOnComplete];

const validatePassword = createHandlerChainRunnerForOldOnComplete(chain, "ValidatePassword");
export default validatePassword;
