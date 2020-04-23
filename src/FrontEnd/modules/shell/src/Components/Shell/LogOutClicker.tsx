import { connect, ResolveThunks } from "react-redux";
import * as React from "react";
import Icon from "@insite/mobius/Icon";
import shellTheme from "@insite/shell/ShellTheme";
import ClickerStyle from "@insite/shell/Components/Shell/ClickerStyle";
import LogOut from "@insite/mobius/Icons/LogOut";
import { logOut } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
    logOut,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class LogOutClicker extends React.Component<Props> {
    onClick = () => {
        this.props.logOut();
    };

    render() {
        return <ClickerStyle clickable onClick={this.onClick} title="Log Out">
            <Icon src={LogOut} color={shellTheme.colors.text.accent} />
        </ClickerStyle>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogOutClicker);
