import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import Icon from "@insite/mobius/Icon";
import ClickerStyle from "@insite/shell/Components/Shell/ClickerStyle";
import shellTheme from "@insite/shell/ShellTheme";
import { changeStageMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ShellState, props: OwnProps) => ({
    targetMatchesCurrentStageMode: state.shellContext.stageMode === props.targetStageMode,
});

const mapDispatchToProps = {
    changeStageMode,
};

type OwnProps = { targetStageMode: DeviceType; icon: React.FC; disabled?: boolean };

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

class ViewPortClicker extends React.Component<Props> {
    onClick = () => {
        const { changeStageMode, targetStageMode } = this.props;
        changeStageMode(targetStageMode);
    };

    render() {
        const { targetMatchesCurrentStageMode, icon, disabled, targetStageMode } = this.props;
        const {
            colors: { common, primary, text },
        } = shellTheme;

        let iconColor: string;

        if (disabled) {
            iconColor = common.disabled;
        } else if (targetMatchesCurrentStageMode) {
            iconColor = primary.main;
        } else {
            iconColor = text.accent;
        }

        return (
            <ClickerStyle
                clickable={!targetMatchesCurrentStageMode}
                onClick={this.onClick}
                disabled={disabled}
                title={`${targetStageMode} Preview`}
            >
                <Icon src={icon} color={iconColor} />
            </ClickerStyle>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewPortClicker);
