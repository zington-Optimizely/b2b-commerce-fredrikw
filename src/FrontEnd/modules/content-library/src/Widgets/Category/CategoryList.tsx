import * as React from "react";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
import { CategoryListPageContext } from "@insite/content-library/Pages/CategoryListPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import translate from "@insite/client-framework/Translate";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { css } from "styled-components";
import { getCategoriesDataView } from "@insite/client-framework/Store/UNSAFE_Categories/CategoriesSelector";
import { HomePageContext } from "@insite/content-library/Pages/HomePage";
import loadCategories from "@insite/client-framework/Store/UNSAFE_Categories/Handlers/LoadCategories";

const enum fields {
    showImages = "showImages",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.showImages]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState) => ({
    categoriesDataView: getCategoriesDataView(state),
});

const mapDispatchToProps = {
    loadCategories,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CategoryListStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    container?: GridContainerProps;
    categoryItem?: GridItemProps;
    innerContainer?: GridContainerProps;
    categoryImageItem?: GridItemProps;
    categoryImageLink?: LinkPresentationProps;
    categoryImage?: LazyImageProps;
    categoryNameLinkItem?: GridItemProps;
    categoryNameLink?: LinkPresentationProps;
    categoryName?: TypographyProps;
    subCategoryNameLinkItem?: GridItemProps;
    subCategoryNameLink?: LinkPresentationProps;
    viewMoreLinkItem?: GridItemProps;
    viewMoreLink?: LinkPresentationProps;
}

const styles: CategoryListStyles = {
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css` margin: auto; `,
    },
    container: {
        gap: 20,
    },
    categoryItem: {
        width: [12, 12, 4, 4, 2],
    },
    innerContainer: {
        gap: 10,
    },
    categoryImageItem: {
        width: 12,
        css: css` height: 160px; `,
    },
    categoryImage: {
        width: "160px",
        height: "160px",
    },
    categoryNameLinkItem: {
        width: 12,
        css: css` padding-bottom: 8px; `,
    },
    categoryName: {
        css: css`
            color: #363636;
            font-weight: bold;
        `,
    },
    subCategoryNameLinkItem: {
        width: 12,
    },
    viewMoreLinkItem: {
        width: 12,
        css: css`
            font-weight: bold;
            padding-top: 10px;
        `,
    },
};

export const listStyles = styles;

class CategoryList extends React.Component<Props> {
    UNSAFE_componentWillMount(): void {
        const { categoriesDataView, loadCategories } = this.props;
        if (!categoriesDataView.isLoading && !categoriesDataView.value) {
            loadCategories();
        }
    }

    render() {
        const { categoriesDataView, fields: { showImages } } = this.props;
        if (categoriesDataView.isLoading) {
            return (
                <StyledWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.spinner} />
                </StyledWrapper>
            );
        }

        if (!categoriesDataView.value) {
            return null;
        }

        return (
            <GridContainer {...styles.container}>
                {categoriesDataView.value.map((category) => (
                    <GridItem key={category.id.toString()} {...styles.categoryItem}>
                        <GridContainer {...styles.innerContainer}>
                            {showImages
                                && <GridItem {...styles.categoryImageItem}>
                                    {category.path
                                        && <Link href={category.path} {...styles.categoryImageLink}>
                                            <LazyImage src={category.smallImagePath} {...styles.categoryImage} />
                                        </Link>
                                    }
                                </GridItem>
                            }
                            <GridItem {...styles.categoryNameLinkItem}>
                                <Link href={category.path} {...styles.categoryNameLink}>
                                    <Typography {...styles.categoryName}>{category.shortDescription}</Typography>
                                </Link>
                            </GridItem>
                            {category.subCategories && category.subCategories.slice(0, 4).map((subCategory) => (
                                <GridItem key={subCategory.id.toString()} {...styles.subCategoryNameLinkItem}>
                                    <Link href={subCategory.path} {...styles.subCategoryNameLink}>
                                        {subCategory.shortDescription}
                                    </Link>
                                </GridItem>
                            ))}
                            {category.subCategories && category.subCategories.length > 4
                                && <GridItem {...styles.viewMoreLinkItem}>
                                    <Link href={category.path} {...styles.viewMoreLink}>{translate("View More")}</Link>
                                </GridItem>
                            }
                        </GridContainer>
                    </GridItem>
                ))}
            </GridContainer>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CategoryList),
    definition: {
        group: "Categories",
        allowedContexts: [CategoryListPageContext, HomePageContext],
        isSystem: true,
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
