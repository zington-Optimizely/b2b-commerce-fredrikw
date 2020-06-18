import * as React from "react";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import { connect, ResolveThunks } from "react-redux";
import Page from "@insite/mobius/Page";
import Zone from "@insite/client-framework/Components/Zone";
import loadCurrentCountries from "@insite/client-framework/Store/Data/Countries/Handlers/LoadCurrentCountries";
import loadPaymentProfiles from "@insite/client-framework/Store/Data/PaymentProfiles/Handlers/LoadPaymentProfiles";
import SavedPaymentsEditCardModal from "@insite/content-library/Widgets/SavedPayments/SavedPaymentsEditCardModal";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import { getPaymentProfilesDataView } from "@insite/client-framework/Store/Data/PaymentProfiles/PaymentProfilesSelectors";

const mapStateToProps = (state: ApplicationState) => ({
    countries: getCurrentCountries(state),
    paymentProfilesDataView: getPaymentProfilesDataView(state, parameter),
});

const mapDispatchToProps = {
    loadCurrentCountries,
    loadPaymentProfiles,
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const parameter = {};

class SavedPaymentsPage extends React.Component<Props> {
    componentDidMount() {
        if (!this.props.countries) {
            this.props.loadCurrentCountries();
        }

        this.loadPaymentProfilesIfNeeded();
    }

    componentDidUpdate(): void {
        this.loadPaymentProfilesIfNeeded();
    }

    loadPaymentProfilesIfNeeded = () => {
        if (!this.props.paymentProfilesDataView.value && !this.props.paymentProfilesDataView.isLoading) {
            this.props.loadPaymentProfiles(parameter);
        }
    };

    render() {
        return (
            <Page>
                <PaymentProfilesContext.Provider value={this.props.paymentProfilesDataView}>
                    <Zone contentId={this.props.id} zoneName="Content"/>
                    {this.props.countries
                        && <SavedPaymentsEditCardModal/>
                    }
                </PaymentProfilesContext.Provider>
            </Page>
        );
    }
}

export const PaymentProfilesContext = React.createContext<ReturnType<typeof getPaymentProfilesDataView>>({} as ReturnType<typeof getPaymentProfilesDataView>);

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(SavedPaymentsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        isSystemPage: true,
    },
};

export default pageModule;

export const SavedPaymentsPageContext = "SavedPaymentsPage";
