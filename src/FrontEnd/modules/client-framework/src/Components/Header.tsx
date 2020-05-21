import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { createPageElement } from "@insite/client-framework/Components/ContentItemStore";
import { getHeader } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { loadPageByType } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";

const mapStateToProps = (state: ApplicationState) => ({
    header: getHeader(state),
});

const mapDispatchToProps = {
    loadPageByType,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class Header extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const props = this.props;
        if (props.header.id === "") {
            props.loadPageByType("Header");
        }
    }

    render() {
        const { header } = this.props;
        if (header.id === "") {
            return null;
        }

        return createPageElement(header.type, header);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
