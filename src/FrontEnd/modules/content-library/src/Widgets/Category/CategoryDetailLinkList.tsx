import * as React from "react";
import { HasCategoryContext, withCategory } from "@insite/client-framework/Components/CategoryContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import { css } from "styled-components";

interface Props extends WidgetProps, HasCategoryContext {
}

export interface CategoryDetailLinkListStyles {
    container?: GridContainerProps;
    subCategoryNameLinkItem?: GridItemProps;
    subCategoryNameLink?: LinkPresentationProps;
}

const styles: CategoryDetailLinkListStyles = {
    container: {
        gap: 0,
    },
    subCategoryNameLinkItem: {
        width: 12,
        css: css` padding-bottom: 10px; `,
    },
};

export const detailLinkListStyles = styles;

const CategoryDetailLinkList: React.FunctionComponent<Props> = ({
    category,
}: Props) => {
    if (!category || !category.subCategories) {
        return null;
    }

    return <GridContainer {...styles.container}>
        {category.subCategories.map((subCategory) => (
            <GridItem key={subCategory.id.toString()} {...styles.subCategoryNameLinkItem}>
                <Link
                    href={subCategory.path}
                    {...styles.subCategoryNameLink}
                    data-test-selector={`categoryDetailLinkListLink${subCategory.id}`}>
                    {subCategory.shortDescription}
                </Link>
            </GridItem>
        ))}
    </GridContainer>;
};

const widgetModule: WidgetModule = {
    component: withCategory(CategoryDetailLinkList),
    definition: {
        group: "Categories",
        icon: "LinkList",
        isSystem: true,
    },
};

export default widgetModule;
