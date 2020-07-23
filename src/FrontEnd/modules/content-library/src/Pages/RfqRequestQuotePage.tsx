import Zone from "@insite/client-framework/Components/Zone";
import loadAccountsIfNeeded from "@insite/client-framework/Store/Pages/RfqRequestQuote/Handlers/LoadAccountsIfNeeded";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapDispatchToProps = {
    loadAccountsIfNeeded,
};

type Props = ResolveThunks<typeof mapDispatchToProps> & PageProps;

class RfqRequestQuotePage extends React.Component<Props> {
    componentDidMount() {
        this.props.loadAccountsIfNeeded();
    }

    render() {
        return <Page>
            <Zone contentId={this.props.id} zoneName="Content"/>
        </Page>;
    }
}

const pageModule: PageModule = {
    component: connect(null, mapDispatchToProps)(RfqRequestQuotePage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        fieldDefinitions: [],
        pageType: "System",
    },
};

export default pageModule;

export const RfqRequestQuotePageContext = "RfqRequestQuotePage";
