import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import { connect, ResolveThunks } from "react-redux";
import loadCurrentCountries from "@insite/client-framework/Store/Data/Countries/Handlers/LoadCurrentCountries";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadCurrentBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadCurrentBillTo";
import { getCurrentShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import loadCurrentShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTo";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import loadAddressFields from "@insite/client-framework/Store/Data/AddressFields/Handlers/LoadAddressFields";

const mapStateToProps = (state: ApplicationState) => ({
    currentBillToState: getCurrentBillToState(state),
    currentShipToState: getCurrentShipToState(state),
    shouldLoadAddressFields: !getAddressFieldsDataView(state).value,
    shouldLoadCountries: !getCurrentCountries(state),
});

const mapDispatchToProps = {
    loadCurrentBillTo,
    loadCurrentShipTo,
    loadAddressFields,
    loadCurrentCountries,
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

class AddressesPage extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const { currentBillToState, currentShipToState, shouldLoadAddressFields, shouldLoadCountries,
            loadCurrentBillTo, loadCurrentShipTo, loadAddressFields, loadCurrentCountries } = this.props;

        if (!currentBillToState.value) {
            loadCurrentBillTo();
        }
        if (!currentShipToState.value) {
            loadCurrentShipTo();
        }
        if (shouldLoadAddressFields) {
            loadAddressFields();
        }
        if (shouldLoadCountries) {
            loadCurrentCountries();
        }
    }
    render() {
        return (
            <Page>
                <Zone contentId={this.props.id} zoneName="Content"/>
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AddressesPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
    },
};

export default pageModule;

export const AddressesPageContext = "AddressesPage";
