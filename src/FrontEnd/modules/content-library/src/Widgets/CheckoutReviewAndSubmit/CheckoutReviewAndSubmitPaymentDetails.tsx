import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import validateCreditCard from "@insite/client-framework/Common/Utilities/validateCreditCard";
import logger from "@insite/client-framework/Logger";
import { TokenExConfig } from "@insite/client-framework/Services/SettingsService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadTokenExConfig from "@insite/client-framework/Store/Context/Handlers/LoadTokenExConfig";
import { getBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTo";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import checkoutWithPayPal from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/CheckoutWithPayPal";
import placeOrder from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/PlaceOrder";
import preloadOrderConfirmationData from "@insite/client-framework/Store/Pages/OrderConfirmation/Handlers/PreloadOrderConfirmationData";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import CreditCardBillingAddressEntry, { CreditCardBillingAddressEntryStyles } from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CreditCardBillingAddressEntry";
import CreditCardDetailsEntry, { CreditCardDetailsEntryStyles } from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CreditCardDetailsEntry";
import PaymentProfileBillingAddress from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/PaymentProfileBillingAddress";
import SavedPaymentProfileEntry, { SavedPaymentProfileEntryStyles } from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/SavedPaymentProfileEntry";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import { generateTokenExFrameStyleConfig } from "@insite/mobius/TokenExFrame";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css, ThemeProps, withTheme } from "styled-components";
import PayPalButton, { PayPalButtonStyles } from "./PayPalButton";

const mapStateToProps = (state: ApplicationState) => {
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);
    return ({
        cartState,
        billToState: getBillToState(state, cartState.value ? cartState.value.billToId : undefined),
        countries: getCurrentCountries(state),
        websiteSettings: getSettingsCollection(state).websiteSettings,
        cartSettings: getSettingsCollection(state).cartSettings,
        tokenExConfigs: state.context.tokenExConfigs,
        orderConfirmationPageLink: getPageLinkByPageType(state, "OrderConfirmationPage"),
        savedPaymentsPageLink: getPageLinkByPageType(state, "SavedPaymentsPage"),
        session: state.context.session,
        signInPageLink: getPageLinkByPageType(state, "SignInPage"),
        checkoutReviewAndSubmitPageLink: getPageLinkByPageType(state, "CheckoutReviewAndSubmitPage"),
        payPalRedirectUri: state.pages.checkoutReviewAndSubmit.payPalRedirectUri,
        location: getLocation(state),
    });
};

const mapDispatchToProps = {
    loadTokenExConfig,
    placeOrder,
    checkoutWithPayPal,
    preloadOrderConfirmationData,
    loadBillTo,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & ThemeProps<BaseTheme> & HasHistory;

export interface CheckoutReviewAndSubmitPaymentDetailsStyles {
    form?: InjectableCss;
    fieldset?: InjectableCss;
    paymentDetailsHeading?: TypographyPresentationProps;
    paymentMethodPayPalText?: TypographyPresentationProps;
    paymentMethodAndPONumberContainer?: GridContainerProps;
    paymentMethodGridItem?: GridItemProps;
    paymentMethodSelect?: SelectPresentationProps;
    paymentProfileBillingAddress?: any;
    paymentProfileExpiredErrorWrapper?: InjectableCss;
    paymentProfileExpiredErrorText?: TypographyPresentationProps;
    paymentProfileEditCardLink?: LinkPresentationProps;
    poNumberGridItem?: GridItemProps;
    poNumberText?: TextFieldPresentationProps;
    mainContainer?: GridContainerProps;
    savedPaymentProfile?: SavedPaymentProfileEntryStyles;
    creditCardDetailsGridItem?: GridItemProps;
    creditCardDetails?: CreditCardDetailsEntryStyles;
    creditCardAddressGridItem?: GridItemProps;
    creditCardAddress?: CreditCardBillingAddressEntryStyles;
    payPalButton?: PayPalButtonStyles;
}

export const checkoutReviewAndSubmitPaymentDetailsStyles: CheckoutReviewAndSubmitPaymentDetailsStyles = {
    fieldset: {
        css: css`
            margin: 0;
            padding: 0;
            border: 0;
        `,
    },
    paymentDetailsHeading: { variant: "h5" },
    paymentMethodAndPONumberContainer: {
        gap: 10,
        css: css` margin-bottom: 1rem; `,
    },
    paymentMethodGridItem: {
        width: 6,
        css: css` flex-direction: column; `,
    },
    paymentProfileExpiredErrorWrapper: {
        css: css`
            display: flex;
            width: 100%;
        `,
    },
    paymentProfileExpiredErrorText: { color: "danger" },
    paymentProfileEditCardLink: { css: css` margin-left: 1rem; ` },
    poNumberGridItem: { width: 6 },
    creditCardDetailsGridItem: { width: [12, 12, 12, 6, 6] },
    creditCardAddressGridItem: {
        width: [12, 12, 12, 6, 6],
        css: css` flex-direction: column; `,
    },
};

// TokenEx doesn't provide an npm package or type definitions for using the iframe solution.
// This is just enough types to avoid the build warnings and make using TokenEx a bit easier.
type TokenExIframeStyles = {
    base?: string;
    focus?: string;
    error?: string;
    cvv?: TokenExIframeStyles;
};

type TokenExIframeConfig = {
    tokenExID: string;
    tokenScheme: string;
    authenticationKey: string;
    timestamp: string;
    origin: string;
    styles?: TokenExIframeStyles;
    pci?: boolean;
    enableValidateOnBlur?: boolean;
    inputType?: "number" | "tel" | "text";
    debug?: boolean;
    cvv?: boolean;
    cvvOnly?: boolean;
    cvvContainerID?: string;
    cvvInputType?: "number" | "tel" | "text";
};

type TokenExPCIIframeConfig = TokenExIframeConfig & {
    pci: true;
    enablePrettyFormat?: boolean;
};

type TokenExCvvOnlyIframeConfig = TokenExIframeConfig & {
    cvvOnly: true;
    token?: string;
    cardType?: string;
};

type IFrame = {
    new(containerId: string, config: TokenExPCIIframeConfig | TokenExCvvOnlyIframeConfig): IFrame;
    load: () => void;
    on: (eventName: "validate" | "tokenize" | "error" | "cardTypeChange", callback: (data: any) => void) => void;
    remove: () => void;
    validate: () => void;
    tokenize: () => void;
};

type TokenEx = {
    Iframe: IFrame;
};

declare const TokenEx: TokenEx;
let tokenExIframe: IFrame | undefined;

let tokenExFrameStyleConfig: TokenExIframeStyles;

const isNonEmptyString = (value: string | undefined) => value !== undefined && value.trim() !== "";

const isMonthAndYearBeforeToday = (month: number, year: number) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    return (year < currentYear) || (year === currentYear && month < currentMonth + 1);
};

const convertTokenExCardTypeToApiData = (cardType: string) => {
    if (cardType.includes("american")) {
        return "AMERICAN EXPRESS";
    }

    return cardType.toUpperCase();
};

const convertApiDataToTokenExCardType = (cardType: string) => {
    const loweredCardType = cardType.toLowerCase();

    if (loweredCardType === "mastercard") {
        return "masterCard";
    }
    if (loweredCardType === "american express") {
        return "americanExpress";
    }

    return loweredCardType;
};

const styles = checkoutReviewAndSubmitPaymentDetailsStyles;
const StyledForm = getStyledWrapper("form");
const StyledFieldSet = getStyledWrapper("fieldset");

const CheckoutReviewAndSubmitPaymentDetails = ({
                                                   loadBillTo,
                                                   cartState,
                                                   billToState,
                                                   countries,
                                                   websiteSettings,
                                                   cartSettings,
                                                   tokenExConfigs,
                                                   placeOrder,
                                                   orderConfirmationPageLink,
                                                   savedPaymentsPageLink,
                                                   history,
                                                   checkoutWithPayPal,
                                                   payPalRedirectUri,
                                                   preloadOrderConfirmationData,
                                                   loadTokenExConfig,
                                                   theme,
                                                   session,
                                                   checkoutReviewAndSubmitPageLink,
                                                   location,
                                               }: Props) => {
    const [paymentMethod, setPaymentMethod] = useState("");
    const [poNumber, setPONumber] = useState("");
    const [saveCard, setSaveCard] = useState(false);
    const [cardHolderName, setCardHolderName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardType, setCardType] = useState("");
    const [possibleCardType, setPossibleCardType] = useState("");
    const [expirationMonth, setExpirationMonth] = useState(1);
    const [expirationYear, setExpirationYear] = useState(new Date().getFullYear());
    const [securityCode, setSecurityCode] = useState("");
    const [useBillingAddress, setUseBillingAddress] = useState(true);
    const [address1, setAddress1] = useState("");
    const [countryId, setCountryId] = useState("");
    const [stateId, setStateId] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");

    const [paymentMethodError, setPaymentMethodError] = useState("");
    const [poNumberError, setPONumberError] = useState("");
    const [cardHolderNameError, setCardHolderNameError] = useState("");
    const [cardNumberError, setCardNumberError] = useState("");
    const [cardTypeError, setCardTypeError] = useState("");
    const [securityCodeError, setSecurityCodeError] = useState("");
    const [expirationError, setExpirationError] = useState("");
    const [address1Error, setAddress1Error] = useState("");
    const [countryError, setCountryError] = useState("");
    const [stateError, setStateError] = useState("");
    const [cityError, setCityError] = useState("");
    const [postalCodeError, setPostalCodeError] = useState("");
    const [payPalError, setPayPalError] = useState("");

    const [showFormErrors, setShowFormErrors] = useState(false);
    const [isCardNumberTokenized, setIsCardTokenized] = useState(false);

    // Used in validation of form, since some form elements will not be validated when PayPal is active.
    const [isPayPal, setIsPayPal] = useState(false);
    // Help to work in the flow of React to validate the form.
    // Since setting isPayPal and validating will not have the correct "effect" in place to correctly validate the form.
    const [runSubmitPayPal, setRunSubmitPayPal] = useState(false);

    // will exist after we are redirected back here from paypal
    const { PayerID: payPalPayerId, token: payPalToken } = parseQueryString<{ PayerID?: string; token?: string; }>(location.search);

    const resetForm = () => {
        setCardHolderNameError("");
        setCardNumberError("");
        setCardTypeError("");
        setExpirationError("");
        setSecurityCodeError("");
        setAddress1("");
        setCountryError("");
        setStateError("");
        setCityError("");
        setPostalCodeError("");
        setPayPalError("");
        setIsCardTokenized(false);
    };

    useEffect(() => {
        if (!billToState.value && !billToState.isLoading && cartState.value && cartState.value.billToId) {
            loadBillTo({ billToId: cartState.value.billToId });
        }
    }, [billToState]);

    useEffect(
        () => {
            const script = document.createElement("script");
            script.src = "https://test-htp.tokenex.com/Iframe/Iframe-v3.min.js";
            script.async = true;

            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        },
        [],
    );

    useEffect(() => resetForm(), [paymentMethod]);

    useEffect(
        () => {
            if (isCardNumberTokenized) {
                placeOrder({
                    paymentMethod,
                    poNumber,
                    saveCard,
                    cardHolderName,
                    cardNumber,
                    cardType,
                    expirationMonth,
                    expirationYear,
                    securityCode,
                    useBillingAddress,
                    address1,
                    countryId,
                    stateId,
                    city,
                    postalCode,
                    payPalToken,
                    payPalPayerId,
                    onSuccess: (cartId: string) => {
                        if (!orderConfirmationPageLink) {
                            return;
                        }

                        history.push(`${orderConfirmationPageLink.url}?cartId=${cartId}`);
                    },
                });
            }
        },
        [isCardNumberTokenized],
    );

    useEffect(
        () => {
            if (!cartState.isLoading && cartState.value && cartState.value.paymentMethod) {
                setPaymentMethod(cartState.value.paymentMethod.name);
            }
        },
        [cartState.isLoading],
    );

    // IsPayPal
    // Setup isPayPal from cart.paymentOptions and validates form when cartState changes and is loaded.
    useEffect(
        () => {
            if (cartState.value) {
                const tempIsPayPal = cartState.value.paymentOptions?.isPayPal || !!payPalToken;
                setIsPayPal(tempIsPayPal);
                if (tempIsPayPal) {
                    validateForm();
                }
            }
        },
        [cartState],
    );

    // Submit PayPal
    // When isPayPal and runSubmitPayPal are true will validate form, and submitPayPal with the current page redirectUri and current cart.
    useEffect(
        () => {
            if (isPayPal && runSubmitPayPal) {
                if (!validateForm()) {
                    setShowFormErrors(true);
                    return;
                }
                if (!checkoutReviewAndSubmitPageLink) {
                    return;
                }
                checkoutWithPayPal({ redirectUri: `${window.location.host}${checkoutReviewAndSubmitPageLink.url}` });
            }
        },
        [runSubmitPayPal, isPayPal],
    );

    // Submit PayPal State Check
    // Handles the PayPal button click response, getting the payPal redirectUri from the server on cart update call.
    useEffect(
        () => {
            if (payPalRedirectUri) {
                window.location.href = payPalRedirectUri;
            }
        },
        [payPalRedirectUri],
    );

    const { value: cart } = cartState;

    const { useTokenExGateway } = websiteSettings;
    const { showPayPal } = cartSettings;
    const paymentOptions = cart ? cart.paymentOptions : undefined;
    const paymentMethods = paymentOptions ? paymentOptions.paymentMethods : undefined;

    const paymentMethodDto = paymentMethods?.find(method => method.name === paymentMethod);
    const selectedCountry = countries?.find(country => country.id === countryId);
    const tokenName = paymentMethodDto?.isPaymentProfile ? paymentMethodDto.name
        : useTokenExGateway && paymentMethodDto?.isCreditCard ? ""
            : undefined;

    useEffect(
        () => {
            if (typeof tokenName !== "undefined") {
                loadTokenExConfig({ token: tokenName });
            }
        },
        [paymentMethod],
    );

    const tokenExConfig = typeof tokenName !== "undefined" ? tokenExConfigs[tokenName] : undefined;

    useEffect(
        () => {
            if (tokenExConfig) {
                if (paymentMethodDto?.isPaymentProfile) {
                    setUpTokenExIFrameCvvOnly(tokenExConfig);
                } else if (paymentMethodDto?.isCreditCard) {
                    setUpTokenExIFrame(tokenExConfig);
                }
            }
        },
        [tokenExConfig],
    );

    const setUpTokenExIFrame = (config: TokenExConfig) => {
        if (tokenExIframe) {
            tokenExIframe.remove();
        }

        const iframeConfig: TokenExPCIIframeConfig = {
            tokenExID: config.tokenExId,
            tokenScheme: config.tokenScheme,
            authenticationKey: config.authenticationKey,
            timestamp: config.timestamp,
            origin: config.origin,
            styles: tokenExFrameStyleConfig,
            inputType: "text",
            cvv: true,
            cvvContainerID: "tokenExSecurityCode",
            cvvInputType: "text",
            pci: true,
            enablePrettyFormat: true,
        };

        tokenExIframe = new TokenEx.Iframe("tokenExCardNumber", iframeConfig);
        tokenExIframe.load();
        tokenExIframe.on("tokenize", data => {
            setCardNumber(data.token);
            setSecurityCode("CVV");
            setCardType(convertTokenExCardTypeToApiData(data.cardType));
            setIsCardTokenized(true);
        });
        tokenExIframe.on("cardTypeChange", data => setPossibleCardType(data.possibleCardType));
        tokenExIframe.on("validate", data => {
            setShowFormErrors(true);
            if (data.isValid) {
                setCardNumberError("");
            } else {
                if (data.validator === "required") {
                    setCardNumberError(translate("Credit card number is required."));
                }
                if (data.validator === "format") {
                    setCardNumberError(translate("Credit card number is invalid."));
                }
            }

            if (data.isCvvValid) {
                setSecurityCodeError("");
            } else {
                if (data.cvvValidator === "required") {
                    setSecurityCodeError(translate("Security code is required."));
                }
                if (data.cvvValidator === "format") {
                    setSecurityCodeError(translate("Security code is invalid."));
                }
            }
        });
        tokenExIframe.on("error", (data) => {
            logger.error(data);
            setUpTokenExIFrame(config);
        });
    };

    const setUpTokenExIFrameCvvOnly = (config: TokenExConfig) => {
        if (tokenExIframe) {
            tokenExIframe.remove();
        }

        const iframeConfig: TokenExCvvOnlyIframeConfig = {
            tokenExID: config.tokenExId,
            tokenScheme: paymentMethodDto!.tokenScheme,
            authenticationKey: config.authenticationKey,
            timestamp: config.timestamp,
            origin: config.origin,
            styles: tokenExFrameStyleConfig,
            inputType: "text",
            cvv: true,
            cvvOnly: true,
            token: paymentMethodDto!.name,
            cardType: convertApiDataToTokenExCardType(paymentMethodDto!.cardType),
        };

        tokenExIframe = new TokenEx.Iframe("ppTokenExSecurityCode", iframeConfig);
        tokenExIframe.load();
        tokenExIframe.on("tokenize", _ => setIsCardTokenized(true));
        tokenExIframe.on("validate", data => {
            if (data.isValid) {
                setSecurityCodeError("");
            } else {
                setShowFormErrors(true);
                if (data.validator === "required") {
                    setSecurityCodeError(translate("Security code is required."));
                }
                if (data.validator === "format") {
                    setSecurityCodeError(translate("Security code is invalid."));
                }
            }
        });
        tokenExIframe.on("error", (data) => {
            logger.error(data);
            setUpTokenExIFrameCvvOnly(config);
        });
    };

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPaymentMethod(event.currentTarget.value);
        validatePaymentMethod(event.currentTarget.value);
    };
    const handlePONumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPONumber(event.currentTarget.value);
        validatePONumber(event.currentTarget.value);
    };
    const handleSaveCardChange = (_: React.SyntheticEvent<Element, Event>, value: boolean) => setSaveCard(value);
    const handleCardHolderNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCardHolderName(event.currentTarget.value);
        validateCardHolderName(event.currentTarget.value);
    };
    const handleCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCardNumber(event.currentTarget.value);
        validateCardNumber(event.currentTarget.value);
    };
    const handleCardTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCardType(event.currentTarget.value);
        validateCardType(event.currentTarget.value);
    };
    const handleExpirationMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const month = Number(event.currentTarget.value);
        if (Number.isNaN(month)) {
            return;
        }
        setExpirationMonth(month);
        validateCardExpiration(month, expirationYear);
    };
    const handleExpirationYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const year = Number(event.currentTarget.value);
        if (Number.isNaN(year)) {
            return;
        }
        setExpirationYear(year);
        validateCardExpiration(expirationMonth, year);
    };
    const handleSecurityCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecurityCode(event.currentTarget.value);
        validateSecurityCode(event.currentTarget.value);
    };
    const handleUseBillingAddressChange = (_: React.SyntheticEvent<Element, Event>, value: boolean) => setUseBillingAddress(value);
    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress1(event.currentTarget.value);
        validateAddress1(event.currentTarget.value);
    };
    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCountryId(event.currentTarget.value);
        validateCountry(event.currentTarget.value);
    };
    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setStateId(event.currentTarget.value);
        validateState(event.currentTarget.value);
    };
    const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCity(event.currentTarget.value);
        validateCity(event.currentTarget.value);
    };
    const handlePostalCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPostalCode(event.currentTarget.value);
        validatePostalCode(event.currentTarget.value);
    };

    const handleEditCardClick = () => {
        if (!savedPaymentsPageLink) {
            return;
        }

        history.push(savedPaymentsPageLink.url);
    };

    const validatePaymentMethod = (paymentMethod: string) => {
        const paymentMethodValid = !paymentMethods || paymentMethods.length === 0 || isNonEmptyString(paymentMethod);
        setPaymentMethodError(!paymentMethodValid ? translate("Payment Method is required.") : "");
        return paymentMethodValid;
    };

    const validatePONumber = (poNumber: string) => {
        const poNumberValid = !cart || !cart.requiresPoNumber || isNonEmptyString(poNumber);
        setPONumberError(!poNumberValid ? translate("PO Number is required.") : "");
        return poNumberValid;
    };

    const validateCardHolderName = (cardHolderName: string) => {
        const cardHolderNameValid = !paymentMethodDto?.isCreditCard || isNonEmptyString(cardHolderName);
        setCardHolderNameError(!cardHolderNameValid ? translate("Cardholder name is required.") : "");
        return cardHolderNameValid;
    };

    const validateCardNumber = (cardNumber: string) => {
        let cardNumberEmpty = false;
        let cardNumberValid = true;

        if (paymentMethodDto?.isCreditCard && !useTokenExGateway) {
            cardNumberEmpty = !isNonEmptyString(cardNumber);
            cardNumberValid = validateCreditCard(cardNumber);
        }

        if (cardNumberEmpty) {
            setCardNumberError(translate("Credit card number is required."));
        } else if (!cardNumberValid) {
            setCardNumberError(translate("Credit card number is invalid."));
        } else {
            setCardNumberError("");
        }

        return { cardNumberEmpty, cardNumberValid };
    };

    const validateCardType = (cardType: string) => {
        const cardTypeValid = !paymentMethodDto?.isCreditCard || useTokenExGateway || (!useTokenExGateway && isNonEmptyString(cardType));
        setCardTypeError(!cardTypeValid ? translate("Credit card type is required.") : "");
        return cardTypeValid;
    };

    const validateCardExpiration = (expirationMonth: number, expirationYear: number) => {
        const cardExpired = paymentMethodDto?.isCreditCard && isMonthAndYearBeforeToday(expirationMonth, expirationYear);
        setExpirationError(cardExpired ? translate("Card is expired. Please enter a valid expiration date.") : "");
        return cardExpired;
    };

    const validateSecurityCode = (securityCode: string) => {
        let securityCodeEmpty = false;
        let securityCodeValid = true;

        if (paymentMethodDto?.isCreditCard && !useTokenExGateway) {
            securityCodeEmpty = !isNonEmptyString(securityCode);
            securityCodeValid = /^\d+$/.test(securityCode);
        }

        if (securityCodeEmpty) {
            setSecurityCodeError(!securityCodeValid ? translate("Security code is required.") : "");
        } else if (!securityCodeValid) {
            setSecurityCodeError(translate("Security code is invalid."));
        } else {
            setSecurityCodeError("");
        }

        return { securityCodeEmpty, securityCodeValid };
    };

    const validateAddress1 = (address1: string) => {
        const address1Valid = !paymentMethodDto?.isCreditCard || useBillingAddress || (!useBillingAddress && isNonEmptyString(address1));
        setAddress1Error(!address1Valid ? translate("Address is required.") : "");
        return address1Valid;
    };

    const validateCountry = (countryId: string) => {
        const countryValid = !paymentMethodDto?.isCreditCard || useBillingAddress || (!useBillingAddress && isNonEmptyString(countryId));
        setCountryError(!countryValid ? translate("Country is required.") : "");
        return countryValid;
    };

    const validateState = (stateId: string) => {
        const stateValid = !paymentMethodDto?.isCreditCard || useBillingAddress || (!useBillingAddress && isNonEmptyString(stateId));
        setStateError(!stateValid ? translate("State is required.") : "");
        return stateValid;
    };

    const validateCity = (city: string) => {
        const cityValid = !paymentMethodDto?.isCreditCard || useBillingAddress || (!useBillingAddress && isNonEmptyString(city));
        setCityError(!cityValid ? translate("City is required.") : "");
        return cityValid;
    };

    const validatePostalCode = (postalCode: string) => {
        const postalCodeValid = !paymentMethodDto?.isCreditCard || useBillingAddress || (!useBillingAddress && isNonEmptyString(postalCode));
        setPostalCodeError(!postalCodeValid ? translate("Postal Code is required.") : "");
        return postalCodeValid;
    };

    const validateForm = () => {
        const paymentMethodValid = validatePaymentMethod(paymentMethod);
        if (isPayPal) {
            return paymentMethodValid;
        }

        if (paymentMethodDto?.isPaymentProfile || (paymentMethodDto?.isCreditCard && useTokenExGateway)) {
            tokenExIframe?.validate();
        }

        const poNumberValid = validatePONumber(poNumber);
        const cardHolderNameValid = validateCardHolderName(cardHolderName);
        const cardNumberResult = validateCardNumber(cardNumber);
        const cardTypeValid = validateCardType(cardType);
        const cardExpired = validateCardExpiration(expirationMonth, expirationYear);
        const securityCodeResult = validateSecurityCode(securityCode);
        const address1Valid = validateAddress1(address1);
        const countryValid = validateCountry(countryId);
        const stateValid = validateState(stateId);
        const cityValid = validateCity(city);
        const postalCodeValid = validatePostalCode(postalCode);

        return paymentMethodValid
            && poNumberValid
            && cardHolderNameValid
            && !cardNumberResult.cardNumberEmpty
            && cardNumberResult.cardNumberValid
            && cardTypeValid
            && !cardExpired
            && !securityCodeResult.securityCodeEmpty
            && securityCodeResult.securityCodeValid
            && address1Valid
            && countryValid
            && stateValid
            && cityValid
            && postalCodeValid;
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            setShowFormErrors(true);
            return false;
        }

        if ((paymentMethodDto?.isPaymentProfile || (paymentMethodDto?.isCreditCard && useTokenExGateway)) && !isPayPal) {
            tokenExIframe?.tokenize();
        } else {
            placeOrder({
                paymentMethod,
                poNumber,
                saveCard,
                cardHolderName,
                cardNumber,
                cardType,
                expirationMonth,
                expirationYear,
                securityCode,
                useBillingAddress,
                address1,
                countryId,
                stateId,
                city,
                postalCode,
                payPalToken,
                payPalPayerId,
                onSuccess: (cartId: string) => {
                    preloadOrderConfirmationData({
                        cartId,
                        onSuccess: () => {
                            history.push(`${orderConfirmationPageLink!.url}?cartId=${cartId}`);
                        },
                    });
                },
            });
        }

        return false;
    };

    const submitPayPalRequest = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (!checkoutReviewAndSubmitPageLink) {
            return;
        }
        if (!session?.isAuthenticated) {
            return;
        }
        setPaymentMethod("");
        setRunSubmitPayPal(true);
        setIsPayPal(true);
    };

    if (!tokenExFrameStyleConfig) {
        tokenExFrameStyleConfig = generateTokenExFrameStyleConfig({ theme });
    }

    if (!cart || !paymentOptions || !orderConfirmationPageLink) {
        return null;
    }

    return (
        <StyledForm {...styles.form} id="reviewAndSubmitPaymentForm" onSubmit={handleFormSubmit} noValidate={true} data-test-selector="reviewAndSubmitPaymentForm">
            <StyledFieldSet {...styles.fieldset}>
                <Typography {...styles.paymentDetailsHeading} as="h2">
                    {translate("Payment Details")}
                </Typography>
                {isPayPal
                && <Typography {...styles.paymentMethodPayPalText} as="span">
                    {translate("Payment Method: PayPal")}
                </Typography>}
                {!isPayPal
                && <GridContainer {...styles.paymentMethodAndPONumberContainer}>
                    {paymentMethods && paymentMethods.length > 0
                    && <GridItem {...styles.paymentMethodGridItem}>
                        <Select
                            {...styles.paymentMethodSelect}
                            label={translate("Payment Method")}
                            value={paymentMethod ?? paymentMethodDto?.name}
                            onChange={handlePaymentMethodChange}
                            required
                            error={showFormErrors && paymentMethodError}
                            data-test-selector="checkoutReviewAndSubmit_paymentMethod"
                        >
                            <option value="">{translate("Select Payment Method")}</option>
                            {paymentMethods.map(method => (
                                <option key={method.name} value={method.name}>{method.description}</option>
                            ))}
                        </Select>
                        {showPayPal
                        && <PayPalButton {...styles.payPalButton} submitPayPalRequest={submitPayPalRequest}
                                         error={showFormErrors ? payPalError : undefined}></PayPalButton>}
                        {paymentMethodDto?.isPaymentProfile && !paymentMethodDto.isPaymentProfileExpired
                        && <PaymentProfileBillingAddress
                            address={paymentMethodDto.billingAddress}
                            extendedStyles={styles.paymentProfileBillingAddress}
                        />
                        }
                        {paymentMethodDto?.isPaymentProfile && paymentMethodDto.isPaymentProfileExpired
                        && <StyledWrapper {...styles.paymentProfileExpiredErrorWrapper}>
                            <Typography {...styles.paymentProfileExpiredErrorText}>
                                {siteMessage("Checkout_PaymentProfileExpired")}
                            </Typography>
                            {savedPaymentsPageLink
                            && <Link
                                {...styles.paymentProfileEditCardLink}
                                onClick={handleEditCardClick}
                            >
                                {translate("Edit Card")}
                            </Link>
                            }
                        </StyledWrapper>
                        }
                    </GridItem>
                    }
                    <GridItem {...styles.poNumberGridItem}>
                        <TextField
                            {...styles.poNumberText}
                            label={
                                <>
                                    <span aria-hidden>{translate("PO Number")}</span>
                                    <VisuallyHidden>{translate("Purchase Order Number")}</VisuallyHidden>
                                </>
                            }
                            value={poNumber}
                            onChange={handlePONumberChange}
                            required={cart.requiresPoNumber}
                            maxLength={50}
                            error={showFormErrors && poNumberError}
                            data-test-selector="checkoutReviewAndSubmit_poNumber"
                        />
                    </GridItem>
                    {paymentMethodDto?.isPaymentProfile && !paymentMethodDto.isPaymentProfileExpired
                    && <GridItem width={6}>
                        <SavedPaymentProfileEntry
                            useTokenExGateway={useTokenExGateway}
                            securityCode={securityCode}
                            onSecurityCodeChange={handleSecurityCodeChange}
                            securityCodeError={showFormErrors ? securityCodeError : undefined}
                            extendedStyles={styles.savedPaymentProfile}
                        />
                    </GridItem>
                    }
                    {cart.showCreditCard && paymentMethodDto?.isCreditCard
                    && <>
                        <GridItem {...styles.creditCardDetailsGridItem}>
                            <CreditCardDetailsEntry
                                canSaveCard={paymentOptions.canStorePaymentProfile}
                                useTokenExGateway={useTokenExGateway}
                                saveCard={saveCard}
                                onSaveCardChange={handleSaveCardChange}
                                cardHolderName={cardHolderName}
                                onCardHolderNameChange={handleCardHolderNameChange}
                                cardHolderNameError={showFormErrors ? cardHolderNameError : undefined}
                                cardNumber={cardNumber}
                                onCardNumberChange={handleCardNumberChange}
                                cardNumberError={showFormErrors ? cardNumberError : undefined}
                                cardType={cardType}
                                possibleCardType={possibleCardType}
                                onCardTypeChange={handleCardTypeChange}
                                cardTypeError={showFormErrors ? cardTypeError : undefined}
                                expirationMonth={expirationMonth}
                                onExpirationMonthChange={handleExpirationMonthChange}
                                expirationYear={expirationYear}
                                onExpirationYearChange={handleExpirationYearChange}
                                expirationError={showFormErrors ? expirationError : undefined}
                                securityCode={securityCode}
                                onSecurityCodeChange={handleSecurityCodeChange}
                                securityCodeError={showFormErrors ? securityCodeError : undefined}
                                availableCardTypes={paymentOptions.cardTypes ?? []}
                                availableMonths={paymentOptions.expirationMonths ?? []}
                                availableYears={paymentOptions.expirationYears ?? []}
                                extendedStyles={styles.creditCardDetails}
                            />
                        </GridItem>
                        <GridItem {...styles.creditCardAddressGridItem}>
                            <CreditCardBillingAddressEntry
                                useBillTo={useBillingAddress}
                                onUseBillToChange={handleUseBillingAddressChange}
                                billTo={billToState.value}
                                address1={address1}
                                onAddress1Change={handleAddressChange}
                                address1Error={showFormErrors ? address1Error : undefined}
                                country={countryId}
                                onCountryChange={handleCountryChange}
                                countryError={showFormErrors ? countryError : undefined}
                                state={stateId}
                                onStateChange={handleStateChange}
                                stateError={showFormErrors ? stateError : undefined}
                                city={city}
                                onCityChange={handleCityChange}
                                cityError={showFormErrors ? cityError : undefined}
                                postalCode={postalCode}
                                onPostalCodeChange={handlePostalCodeChange}
                                postalCodeError={showFormErrors ? postalCodeError : undefined}
                                availableCountries={countries ?? []}
                                availableStates={selectedCountry?.states}
                                extendedStyles={styles.creditCardAddress}
                            />
                        </GridItem>
                    </>
                    }
                </GridContainer>
                }
            </StyledFieldSet>
            {/* This button should only be used to trigger the submit of the form, it is required for IE11 to function. */}
            <button id="reviewAndSubmitPaymentForm-submit" type="submit" style={{ display: "none" }}>{translate("Place Order")}</button>
        </StyledForm>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(withTheme(CheckoutReviewAndSubmitPaymentDetails))),
    definition: {
        group: "Checkout - Review & Submit",
        displayName: "Payment Details",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
    },
};

export default widgetModule;
