import * as React from "react";
import styled, { withTheme } from "styled-components";
import Link, { LinkProps } from "../Link";
import Typography, { TypographyPresentationProps } from "../Typography";
import applyPropBuilder from "../utilities/applyPropBuilder";
import { StyledProp } from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";
import MobiusStyledComponentProps from "../utilities/MobiusStyledComponentProps";

export type BreadcrumbsProps = MobiusStyledComponentProps<"nav", {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<BreadcrumbsProps>;
    /** An array of link props */
    links?: LinkProps[];
    /**
     * Optional props to be passed down to all Link and Typography components.
     * Can be overriden by individual typographyProps in the links array.
     * @themable */
    typographyProps?: TypographyPresentationProps;
}>;

const Slash = styled(Typography as any).attrs({ children: "/" })`
    margin: 0 10px;
`;

const StyledNav = styled.nav.attrs({ "aria-label": "breadcrumbs" })`
    display: flex;
    flex-direction: row;
    align-items: center;
    ${injectCss}
`;

const Breadcrumbs: React.FC<BreadcrumbsProps> = withTheme(({ links, ...otherProps }) => {
    const { applyProp, spreadProps } = applyPropBuilder(otherProps, { component: "breadcrumbs" });
    const typographyProps = spreadProps("typographyProps");
    // return null if `links` is an empty empty object, collection, map, or set.
    if (!links || links.length === 0) return null;
    const children = links.map((link: any, index: number) => {
        const children = link.children;
        // yield null if no children
        if (!React.Children.count(children)) return null;
        const key = typeof children === "string" ? children : index;
        if (index === links.length - 1) {
            return (
                <Typography {...typographyProps} aria-current="page" key={key}>
                    {children}
                </Typography>
            );
        }
        return (
            <React.Fragment key={key}>
                <Link typographyProps={typographyProps} {...link} />
                <Slash {...typographyProps}/>
            </React.Fragment>
        );
    });
    // return null if `links` map yields an array of nulls
    if (Object.keys(children.filter((x: typeof Link) => x !== null)).length === 0) return null;

    return <StyledNav {...otherProps} css={applyProp("css")}>{children}</StyledNav>;
});

Breadcrumbs.defaultProps = {
    links: [],
};

/** @component */
export default Breadcrumbs;

export { Slash, StyledNav };
