import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getProductListDataView } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import CardContainer, { CardContainerStyles } from "@insite/content-library/Components/CardContainer";
import CardContainerMultiColumn, { CardContainerMultiColumnStyles } from "@insite/content-library/Components/CardContainerMultiColumn";
import CardList, { CardListStyles } from "@insite/content-library/Components/CardList";
import { ProductListPageContext, ProductListPageDataContext } from "@insite/content-library/Pages/ProductListPage";
import ProductListProductCard from "@insite/content-library/Widgets/ProductList/ProductListProductCard";
import ProductListProductContext from "@insite/content-library/Widgets/ProductList/ProductListProductContext";
import ProductListProductGridCard from "@insite/content-library/Widgets/ProductList/ProductListProductGridCard";
import Hidden from "@insite/mobius/Hidden";
import LoadingOverlay from "@insite/mobius/LoadingOverlay";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC, ReactNode } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const enum fields {
    showImage = "showImage",
    showCompare = "showCompare",
    showBrand = "showBrand",
    showTitle = "showTitle",
    showPartNumbers = "showPartNumbers",
    showAvailability = "showAvailability",
    showAttributes = "showAttributes",
    showPrice = "showPrice",
    showAddToList = "showAddToList",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.showImage]: boolean;
        [fields.showCompare]: boolean;
        [fields.showTitle]: boolean;
        [fields.showBrand]: boolean;
        [fields.showPartNumbers]: boolean;
        [fields.showAvailability]: boolean;
        [fields.showAttributes]: boolean;
        [fields.showPrice]: boolean;
        [fields.showAddToList]: boolean;
    };
}

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    isLoading: state.pages.productList.isLoading,
    productsDataView: getProductListDataView(state),
    view: state.pages.productList.view || getSettingsCollection(state).productSettings.defaultViewType,
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

export interface ProductListCardListStyles {
    wrapper?: InjectableCss;
    cardList?: CardListStyles;
    noProductsText?: TypographyPresentationProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    cardContainerStyles?: CardContainerStyles;
    cardContainerMultiColumnStyles?: CardContainerMultiColumnStyles;
}

export const listStyles: ProductListCardListStyles = {
    wrapper: {
        css: css`
            margin-top: 20px;
            border-top: 1px solid ${getColor("common.border")};
        `,
    },
    cardList: {
        gridContainer: {
            gap: 0,
        },
    },
    centeringWrapper: {
        css: css`
            width: 100%;
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css` margin: auto; `,
    },
    noProductsText: {
        variant: "h4",
        css: css`
            display: block;
            margin: auto;
        `,
    },
    cardContainerStyles: {
        cardDivider: {
            css: css` width: 100%; `,
        },
        gridItem: {
            css: css` border-bottom: 1px solid ${getColor("common.border")}; `,
        },
    },
};

const styles = listStyles;

const ProductListCardList: FC<Props> = ({ isLoading, productsDataView, view, fields }) => {
    if (isLoading && !productsDataView.value) {
        return <StyledWrapper {...styles.centeringWrapper}>
            <LoadingSpinner {...styles.spinner} data-test-selector="productListCardListSpinner"/>
        </StyledWrapper>;
    }

    if (!productsDataView.value) {
        return null;
    }

    const products = productsDataView.value;

    if (products.length === 0) {
        return <StyledWrapper {...styles.wrapper}>
            <StyledWrapper {...styles.centeringWrapper} data-test-selector="productListNoneFound">
                <Typography {...styles.noProductsText}>{translate("No products found")}</Typography>
            </StyledWrapper>
        </StyledWrapper>;
    }

    const renderProducts = (children: ReactNode) => {
        return products.map(product =>
            <ProductListProductContext product={product} key={product.id}>
                {children}
            </ProductListProductContext>);
    };
    return (
        <StyledWrapper {...styles.wrapper}>
            <ProductListPageDataContext.Consumer>
                {({ ref }) => {
                    return (ref ? <span ref={ref} tabIndex={-1}/> : undefined);
                }}
            </ProductListPageDataContext.Consumer>
            <LoadingOverlay loading={isLoading}>
                <Hidden below="md">
                    <CardList extendedStyles={styles.cardList} data-test-selector={`productListCardContainer${view}`}>
                        {renderProducts(view === "List"
                            ? <CardContainer extendedStyles={styles.cardContainerStyles}>
                                <ProductListProductCard {...fields} />
                            </CardContainer>
                            : <CardContainerMultiColumn extendedStyles={styles.cardContainerMultiColumnStyles}>
                                <ProductListProductGridCard {...fields} />
                            </CardContainerMultiColumn>)}
                    </CardList>
                </Hidden>
                <Hidden above="sm">
                    <CardList extendedStyles={styles.cardList} data-test-selector="cardListProductsNarrow">
                        {renderProducts(<CardContainer extendedStyles={styles.cardContainerStyles}>
                                <ProductListProductCard {...fields} />
                            </CardContainer>)}
                    </CardList>
                </Hidden>
            </LoadingOverlay>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps)(ProductListCardList),
    definition: {
        group: "Product List",
        displayName: "Card List",
        allowedContexts: [ProductListPageContext],
        fieldDefinitions: [
            {
                name: fields.showImage,
                displayName: "Show Image",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.showCompare,
                displayName: "Show Compare",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 2,
            },
            {
                name: fields.showBrand,
                displayName: "Show Brand",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 3,
            },
            {
                name: fields.showTitle,
                displayName: "Show Title",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 4,
            },
            {
                name: fields.showPartNumbers,
                displayName: "Show Part Numbers",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 5,
            },
            {
                name: fields.showAvailability,
                displayName: "Show Availability",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 6,
            },
            {
                name: fields.showAttributes,
                displayName: "Show Attributes",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 7,
            },
            {
                name: fields.showPrice,
                displayName: "Show Price",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 8,
            },
            {
                name: fields.showAddToList,
                displayName: "Show Add To List",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 9,
            },
        ],
    },
};

export default widgetModule;
