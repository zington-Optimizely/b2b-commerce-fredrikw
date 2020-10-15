import baseTheme from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import * as React from "react";
import styled, { css } from "styled-components";

export type PageProps = MobiusStyledComponentProps<
    "main",
    {
        /** CSS value of the background. */
        background?: string;
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<PageProps>;
        /** The amount of padding inside the Page, in pixels. */
        padding?: number;
        /** Breakpoints at which the element should be full width. */
        fullWidth?: boolean[];
    }
>;

const PageStyle = styled.main<Pick<PageProps, "padding" | "fullWidth" | "background">>`
    display: block; /* needed for IE */
    margin: 0 auto;
    width: 100%;
    background: ${({ background, theme }) => resolveColor(background, theme)};
    ${({ padding, theme, fullWidth }) => {
        let paddingValue = padding;
        const { maxWidths } = theme.breakpoints || baseTheme.breakpoints;
        if (padding! > 100) {
            // eslint-disable-next-line no-console
            console.warn("Page: 'padding' property exceeds the maximum allowed value of 100.");
            paddingValue = 100;
        }

        const resolvedFullWith = fullWidth || [];

        return css`
            ${breakpointMediaQueries(theme, [
                resolvedFullWith[0]
                    ? css`
                          max-width: 100%;
                      `
                    : css`
                          max-width: ${maxWidths[1]}px;
                          padding: ${paddingValue}px;
                      `,
                resolvedFullWith[1]
                    ? css`
                          max-width: 100%;
                      `
                    : css`
                          max-width: ${maxWidths[1]}px;
                          padding: ${paddingValue}px;
                      `,
                resolvedFullWith[2]
                    ? css`
                          max-width: 100%;
                      `
                    : css`
                          max-width: ${maxWidths[2]}px;
                          padding: ${paddingValue}px;
                      `,
                resolvedFullWith[3]
                    ? css`
                          max-width: 100%;
                      `
                    : css`
                          max-width: ${maxWidths[3]}px;
                          padding: ${paddingValue}px;
                      `,
                resolvedFullWith[4]
                    ? css`
                          max-width: 100%;
                      `
                    : css`
                          max-width: ${maxWidths[4]}px;
                          padding: ${paddingValue}px;
                      `,
            ])}
            @media print {
                max-width: 100%;
            }
        `;
    }}
    ${injectCss}
`;

/**
 * The Page component is a basic container whose maximum width is controlled by breakpoints defined in the theme,
 * just like the Grid component. It also allows for an arbitrary padding value.
 */
const Page: React.FC<PageProps> = props => <PageStyle {...props} data-test-selector={props["data-test-selector"]} />;

Page.defaultProps = {
    background: "common.background",
    padding: 15,
    fullWidth: [false, false, false, false, false],
};

/** @component */
export default Page;

export { PageStyle };
