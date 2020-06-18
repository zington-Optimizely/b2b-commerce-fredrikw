import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import { connect, ResolveThunks } from "react-redux";
import setInitialValues from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/SetInitialValues";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentAccountState } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import loadCurrentAccount from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadCurrentAccount";

const mapStateToProps = (state: ApplicationState) => ({
    shouldLoadAccount: !getCurrentAccountState(state).value,
});

const mapDispatchToProps = {
    loadCurrentAccount,
    setInitialValues,
};

type Props = ResolveThunks<typeof mapDispatchToProps> & PageProps & ReturnType<typeof mapStateToProps>;

class AccountSettingsPage extends React.Component<Props> {
    componentDidMount() {
        if (this.props.shouldLoadAccount) {
            this.props.loadCurrentAccount();
        } else {
            this.props.setInitialValues();
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.shouldLoadAccount && !this.props.shouldLoadAccount) {
            this.props.setInitialValues();
        }
    }

    render() {
        return <Page>
            <Zone contentId={this.props.id} zoneName="Content" />
        </Page>;
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AccountSettingsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        isSystemPage: true,
    },
};

export default pageModule;

export const AccountSettingsPageContext = "AccountSettingsPage";
