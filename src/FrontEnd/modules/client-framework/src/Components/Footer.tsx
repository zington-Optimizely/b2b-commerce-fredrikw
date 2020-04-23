import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { loadFooter } from "@insite/client-framework/Store/UNSAFE_CurrentPage/CurrentPageActionCreators";
import { createPageElement } from "@insite/client-framework/Components/ContentItemStore";
import { getFooter } from "@insite/client-framework/Store/Data/Pages/PageSelectors";

const mapStateToProps = (state: ApplicationState) => ({
    footer: getFooter(state),
});

const mapDispatchToProps = {
    loadFooter,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class Footer extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const props = this.props;
        if (props.footer.id === "") {
            props.loadFooter();
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
