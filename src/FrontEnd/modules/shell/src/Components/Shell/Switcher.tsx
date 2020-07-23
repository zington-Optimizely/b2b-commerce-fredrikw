import Icon from "@insite/mobius/Icon";
import Edit2 from "@insite/mobius/Icons/Edit2";
import Eye from "@insite/mobius/Icons/Eye";
import Monitor from "@insite/mobius/Icons/Monitor";
import Smartphone from "@insite/mobius/Icons/Smartphone";
import Tablet from "@insite/mobius/Icons/Tablet";
import ContentModeClicker from "@insite/shell/Components/Shell/ContentModeClicker";
import { Spacer } from "@insite/shell/Components/Shell/HeaderBar";
import LogOutClicker from "@insite/shell/Components/Shell/LogOutClicker";
import ViewPortClicker from "@insite/shell/Components/Shell/ViewPortClicker";
import * as React from "react";
import styled from "styled-components";

export const Switcher: React.FC<{ disabled?: boolean}> = ({ disabled }) => {
    return <SwitcherStyle>
            <div>
                <ContentModeClicker targetContentMode="Editing" icon={Edit2} disabled={disabled} />
                <ContentModeClicker targetContentMode="Previewing" icon={Eye} disabled={disabled} />
            </div>
            <Icon src={Spacer} color="#999" />
            <div>
                <ViewPortClicker targetStageMode="Phone" icon={Smartphone} disabled={disabled} />
                <ViewPortClicker targetStageMode="Tablet" icon={Tablet} disabled={disabled} />
                <ViewPortClicker targetStageMode="Desktop" icon={Monitor} disabled={disabled} />
            </div>
            <Icon src={Spacer} color="#999" />
            <LogOutClicker />
        </SwitcherStyle>;
};

const SwitcherStyle = styled.div`
    margin-left: 5px;
    display: flex;
    align-items: center;
    margin-right: 40px;
`;
