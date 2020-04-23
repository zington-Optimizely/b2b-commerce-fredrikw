import * as React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import ShellState from "@insite/shell/Store/ShellState";
import DeviceMobile from "@insite/shell/Components/Icons/DeviceMobile";
import DeviceTablet from "@insite/shell/Components/Icons/DeviceTablet";

const StageFlexContainer = styled.div<StageProps>`
    ${({ stageMode }) => {
        if (stageMode === "Desktop") {
            return "width: calc(100% - 18px); height: calc(100% - 18px);";
        }
    }}
    margin: 0 18px 18px 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

interface StageProps { stageMode: "Desktop" | "Tablet" | "Phone"; }

const StageWrapper = styled.div<StageProps>`
    ${({ stageMode }) => {
        if (stageMode === "Desktop") return "width: 100%; height: 100%;";
        const isMobile = stageMode === "Phone";
        return css`
            position: relative;
            width: ${isMobile ? "400" : "815"}px;
            height: ${isMobile ? "810" : "1200"}px;
        `;
    }}
`;

const DeviceContent = styled.div<StageProps>`
    background: #fdfdfd;
    overflow: auto;
    ${({ stageMode }) => {
        if (stageMode === "Desktop") {
            return css`
                width: 100%;
                height: 100%;
                margin: 0;
                box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.1);
            `;
        }
        const isMobile = stageMode === "Phone";
        return css`
            position: absolute;
            z-index: 2;
            top: ${isMobile ? "28" : "37"}px;
            left: ${isMobile ? "13" : "24"}px;
            width: ${isMobile ? "374" : "768"}px;
            height: ${isMobile ? "813" : "1024"}px;
        `;
    }}
`;

const mapStateToProps = (state: ShellState) => ({
    stageMode: state.shellContext.stageMode,
});

type Props = ReturnType<typeof mapStateToProps> & { className?: string };

const StyledDeviceMobile = styled(DeviceMobile)`
    position: absolute;
    z-index: 3;
    pointer-events: none;
`;

const StyledDeviceTablet = styled(DeviceTablet)`
    position: absolute;
    z-index: 3;
    pointer-events: none;
`;

const Stage: React.FC<Props> = ({ stageMode, children, className }) => {
    return (
        <StageFlexContainer stageMode={stageMode}>
            <StageWrapper stageMode={stageMode}>
                {stageMode === "Phone" && <StyledDeviceMobile />}
                {stageMode === "Tablet" && <StyledDeviceTablet />}
                <DeviceContent stageMode={stageMode} className={className}>{children}</DeviceContent>
            </StageWrapper>
        </StageFlexContainer>
    );
};

export default connect(mapStateToProps)(Stage);
