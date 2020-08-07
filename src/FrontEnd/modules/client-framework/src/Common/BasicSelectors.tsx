import LazyImage from "@insite/mobius/LazyImage";
import Link from "@insite/mobius/Link";
import ListItem, { OrderedList, UnorderedList } from "@insite/mobius/Lists";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { domToReact, HTMLReactParserOptions } from "html-react-parser";
import * as React from "react";

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
            return <UnorderedList css={style as any} {...otherAttribs}>
                {children && domToReact(children, parserOptions)}
            </UnorderedList>;
        }
        if (name === "ol") {
            return <OrderedList css={style as any} {...otherAttribs}>
                {children && domToReact(children, parserOptions)}
            </OrderedList>;
        }
        if (name === "li") {
            return <ListItem css={style as any} {...otherAttribs}>
                {children && domToReact(children, parserOptions)}
            </ListItem>;
        }
        if (name === "img") {
            return <LazyImage as="span" css={style as any} {...otherAttribs} />;
        }
        if (name === "a") {
            return <Link css={style as any} id={otherAttribs.name} {...otherAttribs}>{children && domToReact(children, parserOptions)}</Link>;
        }
    },
};
