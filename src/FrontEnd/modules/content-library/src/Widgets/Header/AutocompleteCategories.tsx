import React, { Fragment } from "react";
import translate from "@insite/client-framework/Translate";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { css } from "styled-components";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { AutocompleteItemModel } from "@insite/client-framework/Types/ApiModels";

interface Props {
    categories: AutocompleteItemModel[] | null;
    focusedItem?: AutocompleteItemModel;
    goToUrl: (url: string) => void;
    extendedStyles?: AutocompleteCategoriesStyles;
}

export interface AutocompleteCategoriesStyles {
    headerText?: TypographyPresentationProps;
    categoryItemText?: TypographyPresentationProps;
    focusedCategoryItemText?: TypographyPresentationProps;
    link?: LinkPresentationProps;
    focusedLink?: LinkPresentationProps;
}

const baseStyles: AutocompleteCategoriesStyles = {
    headerText: {
        weight: "bold",
        css: css`
            text-align: left;
            margin: 10px 0 5px 0;
        `,
    },
    categoryItemText: {
        ellipsis: true,
        css: css`
            width: 100%;
            text-align: left;
            cursor: pointer;
        `,
    },
    focusedCategoryItemText: {
        ellipsis: true,
        css: css`
            width: 100%;
            text-align: left;
            cursor: pointer;
            background-color: lightgray;
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
            width: auto;
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
            width: auto;
            overflow: hidden;
            background-color: lightgray;
        `,
    },
};

class AutocompleteCategories extends React.Component<Props> {
    private readonly styles: AutocompleteCategoriesStyles;

    constructor(props: Props) {
        super(props);

        this.styles = mergeToNew(baseStyles, props.extendedStyles);
    }

    render() {
        const { categories } = this.props;
        if (!categories || categories.length === 0) {
            return null;
        }

        const styles = this.styles;
        return <>
            <Typography {...styles.headerText}>{translate("Categories")}</Typography>
            {categories.map(category => (
                <Fragment key={`${category.id}`}>
                    {category.subtitle
                        && <Typography
                            {...(this.props.focusedItem === category ? styles.focusedCategoryItemText : styles.categoryItemText)}
                            onClick={() => { this.props.goToUrl(category.url); }}
                        >
                            <Link {...styles.link}>{category.title}</Link>
                            <>{` ${translate("in")} ${category.subtitle}`}</>
                        </Typography>
                    }
                    {!category.subtitle
                        && <Link
                            {...(this.props.focusedItem === category ? styles.focusedLink : styles.link)}
                            onClick={() => { this.props.goToUrl(category.url); }}
                        >
                            {category.title}
                        </Link>
                    }
                </Fragment>
            ))}
        </>;
    }
}

export default AutocompleteCategories;
