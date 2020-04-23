import React from "react";
import styled, { css } from "styled-components";
import AccordionSectionPanel from "./AccordionSectionPanel";
import { IconWrapper } from "../Icon";
import getColor from "../utilities/getColor";
import getProp from "../utilities/getProp";
import injectCss from "../utilities/injectCss";
import { AccordionContextData } from "../Accordion/AccordionContext";
import InjectableCss from "../utilities/InjectableCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export type AccordionSectionHeaderProps = MobiusStyledComponentProps<"dt", {
    /** Sets the initial expanded state of the section. */
    expanded?: boolean;
} & InjectableCss & AccordionContextData, "headingLevel">;

const AccordionSectionHeader = styled.dt.attrs((props: AccordionSectionHeaderProps) => ({ role: "heading", ariaLevel: props.headingLevel }))`
    background: ${getColor("common.background")};
    button {
        border: 1px solid ${getColor("common.border")};
        padding: 9px;
        padding-left: 15px;
        height: 100%;
        width: 100%;
        background: transparent;
        font-family: inherit;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        &:focus {
            border-color: ${getProp("theme.focus.color", "#09f")};
            border-style: ${getProp("theme.focus.style", "solid")};
            border-width: ${getProp("theme.focus.width", "2px")};
            outline: 0;
            padding: 8px;
            padding-left: 14px;
        }
    }
    ${/* sc-selector */AccordionSectionPanel} + & button {
        border-top: 0;
        &:focus {
            border-color: ${getProp("theme.focus.color", "#09f")};
            border-style: ${getProp("theme.focus.style", "solid")};
            border-width: ${getProp("theme.focus.width", "2px")};
            padding-top: 7px;
        }
    }
    ${/* sc-selector */IconWrapper}.toggle {
        ${({ expanded }: AccordionSectionHeaderProps) => expanded ? css` transform: rotate(180deg); ` : null}
    }
    ${injectCss}
`;

export default AccordionSectionHeader;
