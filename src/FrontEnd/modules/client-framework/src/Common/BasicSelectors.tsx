import { HTMLReactParserOptions, domToReact } from "html-react-parser";
import * as React from "react";
import styled from "styled-components";
import LazyImage from "@insite/mobius/LazyImage";
import Link from "@insite/mobius/Link";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import injectCss from "@insite/mobius/utilities/injectCss";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";

const BulletList = styled.ul<InjectableCss>`
    list-style-type: disc;
    padding: 0 0 0 40px;
    margin: 1rem 0;
    ${injectCss}
`;

export const parserOptions: HTMLReactParserOptions = {
    replace: (node) => {
        const { name, children, attribs = { style: "" }, ...rest } = node;
        const { style, class: className, ...otherAttribs } = attribs;

        otherAttribs.className = className;

        if ((name && ["h1", "h2", "h3", "h4", "h5", "h6", "body", "p", "legend"].includes(name)) && children) {
            return <Typography css={style as any} {...otherAttribs} variant={name as TypographyProps["variant"]}>
                {children && domToReact(children, parserOptions)}
            </Typography>;
        }
        if (name === "ul") {
            return <BulletList css={style as any} {...otherAttribs}>
                {children && domToReact(children, parserOptions)}
            </BulletList>;
        }
        if (name === "img") {
            return <LazyImage as="span" css={style as any} {...otherAttribs} />;
        }
        if (name === "a") {
            return <Link css={style as any} id={otherAttribs.name} {...otherAttribs}>{children && domToReact(children, parserOptions)}</Link>;
        }
    },
};
