import AccordionSection from "@insite/mobius/AccordionSection";
import { AccordionSectionHeaderProps } from "@insite/mobius/AccordionSection/AccordionSectionHeader";
import AccordionSectionPanel from "@insite/mobius/AccordionSection/AccordionSectionPanel";
import * as React from "react";
import { css } from "styled-components";

const SideBarAccordionSection: React.FunctionComponent<{ title: string; inPopover?: boolean }> = ({
    title,
    children,
    inPopover,
}) => {
    const paddingValue = inPopover ? 30 : 35;
    return (
        <AccordionSection
            title={title}
            titleTypographyProps={{
                variant: "h3",
                css: css`
                    margin-bottom: 0;
                    margin-top: 0;
                `,
            }}
            headerProps={{
                css: css<AccordionSectionHeaderProps>`
                    background: transparent;
                    margin: ${inPopover ? "30px" : 0} -${paddingValue}px 0;
                    &:hover {
                        button {
                            span {
                                ${({ expanded, theme }) => !expanded && `color: ${theme.colors.primary.main};`}
                            }
                        }
                    }
                    button {
                        padding: 9.5px ${paddingValue}px;
                        border: 0;
                        background: ${({ expanded, theme }) =>
                            expanded ? theme.colors.common.accentContrast : "transparent"};
                        > span {
                            color: ${({ expanded, theme }) =>
                                expanded ? theme.colors.common.accent : theme.colors.text.main};
                            font-weight: ${({ expanded }) => (expanded ? "bold" : 300)};
                        }
                        &:focus {
                            border: 0;
                            background: ${({ expanded, theme }) =>
                                expanded ? theme.colors.common.accentContrast : "rgba(0, 0, 0, 0.3)"};
                            padding: 9.5px ${paddingValue}px;
                            > span {
                                color: ${({ expanded, theme }) =>
                                    expanded ? theme.colors.primary.main : theme.colors.text.main};
                            }
                        }
                    }
                    ${/* sc-selector */ AccordionSectionPanel} + & button {
                        &:focus {
                            border: 0;
                            padding: 9.5px ${paddingValue}px;
                        }
                    }
                `,
            }}
            panelProps={{
                css: css`
                    border: 0;
                    padding: 9.5px ${paddingValue}px 19.5px;
                    background-color: ${({ theme }) =>
                        inPopover ? theme.colors.common.background : theme.colors.common.accent};
                    box-shadow: inset 0 1px 6px 0 rgba(0, 0, 0, 0.04);
                    margin: 0 -${paddingValue}px;
                `,
            }}
        >
            {children}
        </AccordionSection>
    );
};

export default SideBarAccordionSection;
