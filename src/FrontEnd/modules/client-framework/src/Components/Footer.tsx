import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { createPageElement } from "@insite/client-framework/Components/ContentItemStore";
import { getFooter } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { loadPageByType } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";

const mapStateToProps = (state: ApplicationState) => ({
    footer: getFooter(state),
});

const mapDispatchToProps = {
    loadPageByType,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class Footer extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const props = this.props;
        if (props.footer.id === "") {
            props.loadPageByType("Footer");
        }
    }

    render() {
        const { footer } = this.props;
        if (footer.id === "") {
            return null;
        }

        return createPageElement(footer.type, footer);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
