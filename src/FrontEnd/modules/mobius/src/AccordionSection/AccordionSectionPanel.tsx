import * as React from "react";
import styled from "styled-components";
import getColor from "../utilities/getColor";
import injectCss from "../utilities/injectCss";
import InjectableCss from "../utilities/InjectableCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export type AccordionSectionPanelProps = MobiusStyledComponentProps<"dd", InjectableCss>;

const AccordionSectionPanel = styled.dd.attrs(() => ({
    role: "region",
}))`
    margin: 0;
    padding: 15px;
    border: 1px solid ${getColor("common.border")};
    border-top: 0;
    display: ${({ hidden }) => (hidden ? "none" : "block")};
    ${injectCss}
`;

export default AccordionSectionPanel;
