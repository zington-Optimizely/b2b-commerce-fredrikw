import { changeContext } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import Icon from "@insite/mobius/Icon";
import Globe from "@insite/mobius/Icons/Globe";
import Monitor from "@insite/mobius/Icons/Monitor";
import Users from "@insite/mobius/Icons/Users";
import getColor from "@insite/mobius/utilities/getColor";
import ArrowDown from "@insite/shell/Components/Icons/ArrowDown";
import { updateShellContext } from "@insite/shell/Services/ContentAdminService";
import shellTheme from "@insite/shell/ShellTheme";
import { loadShellContext } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

interface OwnProps {
    disabled?: boolean;
}

const mapStateToProps = ({ shellContext }: ShellState) => ({
    currentLanguageId: shellContext.currentLanguageId,
    currentPersonaId: shellContext.currentPersonaId,
    currentDeviceType: shellContext.currentDeviceType,
    languages: shellContext.languages,
    personas: shellContext.personas,
    deviceTypes: shellContext.deviceTypes,
});

const mapDispatchToProps = {
    changeContext,
    loadShellContext,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

interface State {
}

const textMain = shellTheme.colors.text.main;

class HeaderBar extends React.Component<Props, State> {
    UNSAFE_componentWillMount(): void {
        if (this.props.languages.length === 0) {
            this.props.loadShellContext();
        }
    }

    onLanguageChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.changeContext(event.currentTarget.value, this.props.currentPersonaId, this.props.currentDeviceType);
    };

    onPersonaChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.changeContext(this.props.currentLanguageId, event.currentTarget.value, this.props.currentDeviceType);
    };

    onDeviceTypeChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.changeContext(this.props.currentLanguageId, this.props.currentPersonaId, event.currentTarget.value as DeviceType);
    };

    changeContext = (languageId: string, personaId: string, deviceType: DeviceType) => {
        updateShellContext(languageId, personaId, deviceType).then(() => {
            this.props.changeContext(languageId, personaId, deviceType);
        });
    };

    render() {
        const { disabled, languages, currentLanguageId, personas, deviceTypes, currentPersonaId, currentDeviceType } = this.props;

        if (languages.length === 0) {
            return null;
        }

        const { hasDeviceSpecificContent, hasPersonaSpecificContent } = languages.filter(o => o.id === currentLanguageId)[0];

        return <HeaderBarStyle>
            <Icon src={Globe} size={20} />
            <SelectWrapper>
                <select onChange={this.onLanguageChange} data-test-selector="headerBar_languageSelect" value={currentLanguageId} disabled={disabled}>
                    {languages.map(({ id, description }) =>
                        <option key={id} value={id}>{description}</option>,
                    )}
                </select>
                <ArrowDown color1={textMain} height={7}/>
            </SelectWrapper>
            {hasDeviceSpecificContent
                && <>
                    <Icon src={Monitor} size={20} />
                    <SelectWrapper>
                        <select onChange={this.onDeviceTypeChange} value={currentDeviceType} disabled={disabled}>
                            {deviceTypes.map(deviceType =>
                                <option key={deviceType} value={deviceType}>{deviceType}</option>,
                            )}
                        </select>
                        <ArrowDown color1={textMain} height={7}/>
                    </SelectWrapper>
                </>}
            {hasPersonaSpecificContent
                && <>
                    <Icon src={Users} size={20} />
                    <SelectWrapper>
                        <select onChange={this.onPersonaChange} data-test-selector="headerBar_personaSelect" value={currentPersonaId} disabled={disabled}>
                            {personas.map(({ id, name }) =>
                                <option key={id} value={id}>{name}</option>,
                            )}
                        </select>
                        <ArrowDown color1={textMain} height={7}/>
                    </SelectWrapper>
                </>}
        </HeaderBarStyle>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar);

const SpacerBar: React.FC = () => <svg focusable="false" viewBox="0 0 32 24" width="32" height="24"><line x1="16" x2="16" y1="0" y2="24" stroke="currentColor" strokeWidth="2" /></svg>;
export const Spacer = React.memo(SpacerBar);

const HeaderBarStyle = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 12px;
`;

const SelectWrapper = styled.div`
    position: relative;
    margin: 0 20px 0 6px;
    select {
        background-color: transparent;
        border: none;
        font-size: 14px;
        color: ${getColor("text.main")};
        appearance: none;
        padding-right: 20px;
        cursor: pointer;
        font-weight: bold;

        option:disabled {
            font-style: italic;
        }

        &:disabled {
            cursor: not-allowed;
            color: ${getColor("common.disabled")};
        }
    }
    svg {
        position: absolute;
        top: 8px;
        right: 5px;
        pointer-events: none;
    }
`;
