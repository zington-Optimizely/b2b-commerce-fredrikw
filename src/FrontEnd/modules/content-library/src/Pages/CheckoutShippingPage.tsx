import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setIsPreloadingData from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/SetIsPreloadingData";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import React, { Component, createContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import updateCart from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/UpdateCart";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import preloadCheckoutShippingData from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/PreloadCheckoutShippingData";
import setInitialValues from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/SetInitialValues";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";

const mapDispatchToProps = {
    preloadCheckoutShippingData,
    setIsPreloadingData,
    updateCart: makeHandlerChainAwaitable(updateCart),
    setInitialValues,
};

const mapStateToProps = (state: ApplicationState) => ({
    isPreloadingData: state.pages.checkoutShipping.isPreloadingData,
    reviewAndSubmitPageLink: getPageLinkByPageType(state, "CheckoutReviewAndSubmitPage"),
});

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & HasHistory;

type Validator = () => Promise<boolean>;

type State = {
    formSubmitAttempted: boolean;
    validators: {
        [key: string]: Validator | undefined;
    },
    isRedirecting: boolean;
};

export const CheckoutShippingFormContext = createContext<State>({
    formSubmitAttempted: false,
    validators: {},
    isRedirecting: false,
});

class CheckoutShippingPage extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            formSubmitAttempted: false,
            validators: {},
            isRedirecting: false,
        };
    }

    componentDidMount() {
        if (!this.props.isPreloadingData) {
            this.props.preloadCheckoutShippingData({ onSuccess: () => {
                    this.props.setInitialValues();
                    this.props.setIsPreloadingData({ isPreloadingData: false });
                } });
        } else {
            this.props.setIsPreloadingData({ isPreloadingData: false });
            this.props.setInitialValues();
        }
    }

    scrollToFirstFormError = () => {
        const firstErrorElement = document.querySelector("[aria-invalid='true']");
        if (firstErrorElement) {
            const formFieldParent = firstErrorElement.closest("[class*='FormFieldStyle']");
            if (!formFieldParent) {
                return;
            }
            const { top } = formFieldParent.getBoundingClientRect();
            window.scrollTo({
                top: top + window.pageYOffset,
                left: 0,
                behavior: "smooth",
            });
        }
    };

    handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        this.setState({ formSubmitAttempted: true });

        const validators: Validator[] = [];
        Object.keys(this.state.validators).forEach(key => {
            const validator = this.state.validators[key];
            if (validator) {
                validators.push(validator);
            }
        });
        const results = await Promise.all(validators.map(v => v()));

        if (results.every(o => o)) {
            this.setState({ isRedirecting: true });
            // TODO ISC-12556
            await this.props.updateCart({});
            this.props.history.push(this.props.reviewAndSubmitPageLink!.url);
        } else {
            this.scrollToFirstFormError();
        }
    };

    render() {
        return (
            <Page>
                <CheckoutShippingFormContext.Provider value={this.state}>
                    <form id="checkoutShippingForm" onSubmit={this.handleFormSubmit} noValidate>
                        <Zone zoneName="Content" contentId={this.props.id} />
                    </form>
                </CheckoutShippingFormContext.Provider>
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(CheckoutShippingPage)),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
    },
};

export const CheckoutShippingPageContext = "CheckoutShippingPage";
export default pageModule;
