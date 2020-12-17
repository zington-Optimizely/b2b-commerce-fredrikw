import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import Icon from "@insite/mobius/Icon";
import Monitor from "@insite/mobius/Icons/Monitor";
import Smartphone from "@insite/mobius/Icons/Smartphone";
import Tablet from "@insite/mobius/Icons/Tablet";
import ClickerStyle from "@insite/shell/Components/Shell/ClickerStyle";
import shellTheme from "@insite/shell/ShellTheme";
import * as React from "react";

type OwnProps = {
    targetStageMode: DeviceType;
    disabled?: boolean;
    currentStageMode: DeviceType;
    changeStageMode: (stageMode: DeviceType) => void;
};

type Props = OwnProps;

class ViewPortClicker extends React.Component<Props> {
    onClick = () => {
        const { changeStageMode, targetStageMode } = this.props;
        changeStageMode(targetStageMode);
    };

    render() {
        const { currentStageMode, disabled, targetStageMode } = this.props;
        const targetMatchesCurrentStageMode = currentStageMode === targetStageMode;

        const {
            colors: { common, text },
        } = shellTheme;

        let iconColor: string;

        if (disabled) {
            iconColor = common.disabled;
        } else if (targetMatchesCurrentStageMode) {
            iconColor = "white";
        } else {
            iconColor = text.accent;
        }

        const icon = targetStageMode === "Phone" ? Smartphone : targetStageMode === "Tablet" ? Tablet : Monitor;

        return (
            <ClickerStyle
                active={targetMatchesCurrentStageMode}
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

export default ViewPortClicker;
