import * as React from "react";
import { HasCategoryContext, withCategory } from "@insite/client-framework/Components/CategoryContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { css } from "styled-components";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";

const enum fields {
    showImages = "showImages",
}

interface Props extends WidgetProps, HasCategoryContext {
}

export interface CategoryDetailSubCategoriesStyles {
    container?: GridContainerProps;
    subCategoryItem?: GridItemProps;
    innerContainer?: GridContainerProps;
    subCategoryImageItem?: GridItemProps;
    subCategoryImageClickable?: ClickablePresentationProps;
    subCategoryImage?: LazyImageProps;
    subCategoryNameLinkItem?: GridItemProps;
    subCategoryNameLink?: LinkPresentationProps;
}

const styles: CategoryDetailSubCategoriesStyles = {
    container: {
        gap: 0,
    },
    subCategoryItem: {
        width: [12, 12, 4, 4, 2],
        css: css` padding-bottom: 30px; `,
    },
    innerContainer: {
        gap: 0,
    },
    subCategoryImageItem: {
        width: [2, 2, 12, 12, 12],
        css: css`
            width: 100%;
            padding: 0 8px 8px 8px;
        `,
    },
    subCategoryImageClickable: {
        css: css` width: 100%; `,
    },
    subCategoryImage: {
        css: css`
            img {
                height: 100%;
            }
        `,
    },
    subCategoryNameLinkItem: {
        width: [10, 10, 12, 12, 12],
        css: css`
            padding-bottom: 8px;
            ${({ theme }: {theme: BaseTheme}) =>
                breakpointMediaQueries(theme, [null, null, css` justify-content: center; `, css` justify-content: center; `, css` justify-content: center; `],
            )}
        `,
    },
    subCategoryNameLink: {
        css: css` width: 100%; `,
        color: "text.main",
        typographyProps: {
            weight: "bold",
            css: css`
                width: 100%;
                text-align: center;
                word-wrap: break-word;
            `,
        },
    },
};

export const detailSubCategoriesStyles = styles;

const CategoryDetailSubCategories: React.FC<Props> = props => {
    if (!props.category || !props.category.subCategories) {
        return null;
    }

    const { fields: { showImages } } = props;

    return <GridContainer {...styles.container}>
        {props.category.subCategories.map((subCategory) => (
            <GridItem key={subCategory.id} {...styles.subCategoryItem}>
                <GridContainer {...styles.innerContainer}>
                    {showImages
                        && <GridItem {...styles.subCategoryImageItem}>
                            {subCategory.smallImagePath
                                && <Clickable href={subCategory.path} {...styles.subCategoryImageClickable}>
                                    <LazyImage src={subCategory.smallImagePath} {...styles.subCategoryImage}/>
                                </Clickable>
                            }
                        </GridItem>
                    }
                    <GridItem {...styles.subCategoryNameLinkItem}>
                        <Link
                            href={subCategory.path}
                            {...styles.subCategoryNameLink}
                            data-test-selector={`categoryDetailSubCategoriesLink${subCategory.id}`}>
                            {subCategory.shortDescription}
                        </Link>
                    </GridItem>
                </GridContainer>
            </GridItem>
        ))}
    </GridContainer>;
};

const widgetModule: WidgetModule = {
    component: withCategory(CategoryDetailSubCategories),
    definition: {
        group: "Categories",
        icon: "LinkList",
        fieldDefinitions: [
            {
                name: fields.showImages,
                displayName: "Show Images",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 1,
            },
        ],
    },
};

export default widgetModule;
