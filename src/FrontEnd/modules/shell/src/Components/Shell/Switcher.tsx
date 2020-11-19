import Icon from "@insite/mobius/Icon";
import Edit2 from "@insite/mobius/Icons/Edit2";
import Eye from "@insite/mobius/Icons/Eye";
import Monitor from "@insite/mobius/Icons/Monitor";
import Smartphone from "@insite/mobius/Icons/Smartphone";
import Tablet from "@insite/mobius/Icons/Tablet";
import ContentModeClicker from "@insite/shell/Components/Shell/ContentModeClicker";
import { Spacer } from "@insite/shell/Components/Shell/HeaderBar";
import HeaderGear from "@insite/shell/Components/Shell/HeaderGear";
import ViewPortClicker from "@insite/shell/Components/Shell/ViewPortClicker";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

const mapStateToProps = ({ shellContext: { mobileCmsModeActive } }: ShellState) => ({
    mobileCmsModeActive,
});

type Props = { disabled?: boolean } & ReturnType<typeof mapStateToProps>;

const Switcher: React.FC<Props> = ({ disabled, mobileCmsModeActive }) => {
    return (
        <SwitcherStyle>
            {mobileCmsModeActive && (
                <>
                    <StyledA
                        target="_blank"
                        href="https://support.insitesoft.com/hc/en-us/articles/360038606591-Use-the-Mobile-App-CMS"
                    >
                        How To Preview Changes
                    </StyledA>
                    <Icon src={Spacer} color="#999" />
                </>
            )}
            <div>
                <ContentModeClicker targetContentMode="Editing" icon={Edit2} disabled={disabled} />
                <ContentModeClicker targetContentMode="Previewing" icon={Eye} disabled={disabled} />
            </div>
            {!mobileCmsModeActive && (
                <>
                    <Icon src={Spacer} color="#999" />
                    <div data-test-selector="preview_switcher">
                        <ViewPortClicker targetStageMode="Phone" icon={Smartphone} disabled={disabled} />
                        <ViewPortClicker targetStageMode="Tablet" icon={Tablet} disabled={disabled} />
                        <ViewPortClicker targetStageMode="Desktop" icon={Monitor} disabled={disabled} />
                    </div>
                </>
            )}
            <Icon src={Spacer} color="#999" />
            <HeaderGear />
        </SwitcherStyle>
    );
};

const SwitcherStyle = styled.div`
    margin-left: 5px;
    display: flex;
    align-items: center;
    margin-right: 30px;
`;

const StyledA = styled.a`
    color: #09f;
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.modal.defaultProps.headlineTypographyProps.size};
`;

export default connect(mapStateToProps)(Switcher);
