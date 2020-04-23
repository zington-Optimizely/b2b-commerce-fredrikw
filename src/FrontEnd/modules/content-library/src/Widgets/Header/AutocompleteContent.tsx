import React from "react";
import translate from "@insite/client-framework/Translate";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { css } from "styled-components";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { AutocompleteItemModel } from "@insite/client-framework/Types/ApiModels";

interface Props {
    content: AutocompleteItemModel[] | null;
    focusedItem?: AutocompleteItemModel;
    goToUrl: (url: string) => void;
    extendedStyles?: AutocompleteContentStyles;
}

export interface AutocompleteContentStyles {
    headerText?: TypographyPresentationProps;
    link?: LinkPresentationProps;
    focusedLink?: LinkPresentationProps;
}

const baseStyles: AutocompleteContentStyles = {
    headerText: {
        weight: "bold",
        css: css`
            text-align: left;
            margin: 10px 0 5px 0;
        `,
    },
    link: {
        typographyProps: {
            ellipsis: true,
            css: css`
                width: 100%;
                text-align: left;
                margin: 5px 0;
            `,
        },
        css: css`
            width: 100%;
            overflow: hidden;
        `,
    },
    focusedLink: {
        typographyProps: {
            ellipsis: true,
            css: css`
                width: 100%;
                text-align: left;
                margin: 5px 0;
            `,
        },
        css: css`
            width: 100%;
            overflow: hidden;
            background-color: lightgray;
        `,
    },
};

class AutocompleteContent extends React.Component<Props> {
    private readonly styles: AutocompleteContentStyles;

    constructor(props: Props) {
        super(props);

        this.styles = mergeToNew(baseStyles, props.extendedStyles);
    }

    render() {
        const { content } = this.props;
        if (!content || content.length === 0) {
            return null;
        }

        const styles = this.styles;
        return <>
            <Typography {...styles.headerText}>{translate("Content")}</Typography>
            {content.map(content => (
                <Link
                    {...(this.props.focusedItem === content ? styles.focusedLink : styles.link)}
                    key={content.url}
                    onClick={() => { this.props.goToUrl(content.url); }}
                >
                    {content.title}
                </Link>
            ))}
        </>;
    }
}

export default AutocompleteContent;
