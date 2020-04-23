import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { OrderModel, OrderLineModel, WishListSettingsModel } from "@insite/client-framework/Types/ApiModels";
import translate from "@insite/client-framework/Translate";
import SmallHeadingAndText from "@insite/content-library/Components/SmallHeadingAndText";
import CardContainer from "@insite/content-library/Components/CardContainer";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import addToWishList, { AddToWishListParameter } from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import siteMessage from "@insite/client-framework/SiteMessage";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import { getOrderState } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { css } from "styled-components";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => ({
    order: getOrderState(state, state.pages.orderDetails.orderNumber),
    wishListSettings: getSettingsCollection(state).wishListSettings,
});

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addToWishList,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderLineNotesStyles {
    typographyStyles?: TypographyProps;
    gridItemStyles?: GridItemProps;
}

export interface OrderDetailSummaryTableStyles {
    gridContainer?: GridContainerProps;
    titleText?: TypographyProps;
    orderLineCardContainer?: GridContainerProps;
    orderLineCardImageGridItem?: GridItemProps;
    orderLineCardImage?: LazyImageProps;
    orderLineCardInfoGridItem?: GridItemProps;
    orderLineCardInfoGridContainer?: GridContainerProps;
    orderLineCardAddToListGridItem?: GridItemProps;
    orderLineCardActionsWide?: HiddenProps;
    orderLineCardActionsNarrow?: HiddenProps;
    overflowMenu?: OverflowMenuPresentationProps;
    addToListClickable?: ClickablePresentationProps;
    orderLineCardAddToListButton?: ButtonPresentationProps;
    productBrandStyles?: ProductBrandStyles;
    productInfoLink?: LinkPresentationProps;
    productInfoDescription?: TypographyProps;
    productInfoSectionOptionsGridItem?: GridItemProps;
    productInfoSectionOptionsList?: InjectableCss;
    productInfoSectionOptionsListItem?: InjectableCss;
    productInfoPartNumbersGridItem?: GridItemProps;
    productInfoSectionOptionsText?: InjectableCss;
    productInfoGridItem?: GridItemProps;
    productInfoGridContainer?: GridContainerProps;
    productInfoBrandDescriptionGridItem?: GridItemProps;
    productInfoBrandDescriptionGridContainer?: GridContainerProps;
    productInfoBrandGridItem?: GridItemProps;
    productInfoDescriptionGridItem?: GridItemProps;
    productInfoErpNumberGridItem?: GridItemProps;
    productInfoManufacturerItemGridItem?: GridItemProps;
    productInfoCustomerProductGridItem?: GridItemProps;
    orderLineInfoPromotionGridItem?: GridItemProps;
    orderLineInfoPromotionList?: InjectableCss;
    orderLineInfoPromotionText?: TypographyProps;
    orderLineInfoGridItem?: GridItemProps;
    orderLineInfoGridContainer?: GridContainerProps;
    orderLinePriceGridItem?: GridItemProps;
    productInfoQtyOrderedGridItem?: GridItemProps;
    productInfoQtyShippedGridItem?: GridItemProps;
    productInfoSubtotalGridItem?: GridItemProps;
    orderLineNotes?: OrderLineNotesStyles;
    productInfoTotalsGridItem?: GridItemProps;
}

const styles: OrderDetailSummaryTableStyles = {
    titleText: {
        variant: "h5",
        as: "h2",
        css: css`
            @media print {
                font-size: 15px;
                padding-top: 15px;
                margin-bottom: 5px;
            }
            padding-top: 30px;
            margin-bottom: 0.5rem;
        `,
    },
    orderLineCardImageGridItem: {
        width: 2,
        css: css`
            @media print {
                max-height: 83px;
                max-width: 83px;
                padding: 0;
            }
        `,
    },
    orderLineCardInfoGridItem: {
        width: [8, 8, 7, 8, 8],
        printWidth: 10,
    },
    orderLineCardInfoGridContainer: {
        gap: 10,
    },
    orderLineCardAddToListGridItem: {
        width: [2, 2, 3, 2, 2],
        printWidth: 0,
    },
    orderLineCardActionsWide: {
        above: "sm",
    },
    orderLineCardActionsNarrow: {
        below: "md",
    },
    productInfoSectionOptionsGridItem: {
        width: 12,
    },
    productInfoPartNumbersGridItem: {
        width: 12,
    },
    productInfoGridItem: {
        width: [12, 12, 12, 6, 6],
        printWidth: 6,
    },
    productInfoGridContainer: {
        gap: 5,
    },
    productInfoBrandDescriptionGridItem: {
        width: 12,
    },
    productInfoBrandDescriptionGridContainer: {
        gap: 5,
    },
    productInfoBrandGridItem: {
        width: 12,
    },
    productInfoDescriptionGridItem: {
        width: 12,
    },
    productInfoErpNumberGridItem: {
        width: [6, 6, 4, 6, 6],
    },
    productInfoManufacturerItemGridItem: {
        width: [6, 6, 4, 6, 6],
    },
    productInfoCustomerProductGridItem: {
        width: [12, 12, 4, 12, 12],
        printWidth: 12,
    },
    orderLineInfoPromotionGridItem: {
        width: 12,
    },
    orderLineInfoPromotionText: {
        size: 12,
        italic: true,
    },
    orderLineInfoGridItem: {
        width: [12, 12, 12, 6, 6],
        printWidth: 6,
    },
    orderLineInfoGridContainer: {
        gap: 5,
    },
    orderLinePriceGridItem: {
        width: 12,
    },
    productInfoQtyOrderedGridItem: {
        width: [6, 6, 4, 4, 4],
        printWidth: 4,
    },
    productInfoQtyShippedGridItem: {
        width: [6, 6, 4, 4, 4],
        printWidth: 4,
    },
    productInfoSubtotalGridItem: {
        width: [12, 12, 4, 4, 4],
        printWidth: 4,
    },
    orderLineNotes: {
        gridItemStyles: {
            width: 12,
        },
    },
    productInfoTotalsGridItem: {
        width: 12,
    },
};

const ProductInfo = ({ orderLine }: { orderLine: OrderLineModel }) => {

    const description = orderLine.shortDescription || orderLine.description;
    const descriptionDisplay = (orderLine.productUri && orderLine.isActiveProduct)
        ? <Link {...styles.productInfoLink} href={orderLine.productUri}>
            {description}
        </Link>
        : <Typography {...styles.productInfoDescription}>{description}</Typography>;

    let sectionOptions: JSX.Element[] = [];
    if (orderLine.sectionOptions && orderLine.sectionOptions) {
        sectionOptions = orderLine.sectionOptions.map(option => (
            <li {...styles.productInfoSectionOptionsListItem} key={option.sectionOptionId.toString()}>
                <Typography {...styles.productInfoSectionOptionsText}>{option.sectionName}: {option.optionName}</Typography>
            </li>
        ));
    }

    return (
        <GridItem {...styles.productInfoGridItem}>
            <GridContainer {...styles.productInfoGridContainer}>
                <GridItem {...styles.productInfoBrandDescriptionGridItem}>
                    <GridContainer {...styles.productInfoBrandDescriptionGridContainer}>
                        {orderLine.brand
                            && <GridItem {...styles.productInfoBrandGridItem}>
                                <ProductBrand brand={orderLine.brand} extendedStyles={styles.productBrandStyles} />
                            </GridItem>
                        }
                        <GridItem {...styles.productInfoDescriptionGridItem}>
                            {descriptionDisplay}
                        </GridItem>
                    </GridContainer>
                </GridItem>
                {sectionOptions.length > 0
                    && <GridItem {...styles.productInfoSectionOptionsGridItem}>
                        <ul {...styles.productInfoSectionOptionsList}>{sectionOptions}</ul>
                    </GridItem>
                }
                <GridItem {...styles.productInfoPartNumbersGridItem}>
                    <GridContainer>
                        <GridItem {...styles.productInfoErpNumberGridItem}>
                            <SmallHeadingAndText heading="Item #" text={orderLine.productErpNumber} />
                        </GridItem>
                        {orderLine.manufacturerItem
                            && <GridItem {...styles.productInfoManufacturerItemGridItem}>
                                <SmallHeadingAndText heading="MFG #" text={orderLine.manufacturerItem} />
                            </GridItem>
                        }
                        {orderLine.customerProductNumber
                            && <GridItem {...styles.productInfoCustomerProductGridItem}>
                                <SmallHeadingAndText heading="My Part #" text={orderLine.customerProductNumber} />
                            </GridItem>
                        }
                    </GridContainer>
                </GridItem>
            </GridContainer>
        </GridItem>
    );
};

const OrderLineInfo = ({ orderLine, order }: { orderLine: OrderLineModel, order: OrderModel }) => {

    let promotions: JSX.Element[] = [];
    if (order.orderPromotions) {
        promotions = order.orderPromotions
            .filter(promotion => promotion.orderHistoryLineId === orderLine.id)
            .map(promotion => (
                <Typography {...styles.orderLineInfoPromotionText} as="li" key={promotion.id}>
                    {promotion.name}
                </Typography>
            ));
    }

    return (
        <GridItem {...styles.orderLineInfoGridItem}>
            <GridContainer {...styles.orderLineInfoGridContainer}>
                <GridItem {...styles.orderLinePriceGridItem}>
                    <SmallHeadingAndText heading={translate("Price")} text={orderLine.unitPriceDisplay} />
                </GridItem>
                {promotions.length > 0
                    && <GridItem {...styles.orderLineInfoPromotionList}>
                        <ul {...styles.orderLineInfoPromotionList}>
                            {promotions}
                        </ul>
                    </GridItem>
                }
                <GridItem {...styles.productInfoTotalsGridItem}>
                    <GridContainer>
                        <GridItem {...styles.productInfoQtyOrderedGridItem}>
                            <SmallHeadingAndText heading={translate("Qty Ordered")} text={`${orderLine.qtyOrdered}`} />
                        </GridItem>
                        <GridItem {...styles.productInfoQtyShippedGridItem}>
                            <SmallHeadingAndText heading={translate("Qty Shipped")} text={`${orderLine.qtyShipped}`} />
                        </GridItem>
                        <GridItem {...styles.productInfoSubtotalGridItem}>
                            <SmallHeadingAndText heading={translate("Subtotal")} text={orderLine.extendedUnitNetPriceDisplay} />
                        </GridItem>
                    </GridContainer>
                </GridItem>
            </GridContainer>
        </GridItem>
    );
};

const OrderLineNotes = ({ orderLine, extendedStyles } : { orderLine: OrderLineModel, extendedStyles?: OrderLineNotesStyles}) => {
    return  orderLine.notes
        ? <GridItem {...extendedStyles?.gridItemStyles}>
            <Typography {...extendedStyles?.typographyStyles}>{orderLine.notes}</Typography>
        </GridItem>
        : null;
};

const OrderLineCard = (props: {
    orderLine: OrderLineModel,
    order: OrderModel,
    wishListSettings?: WishListSettingsModel,
    setAddToListModalIsOpen: (parameter: { products?: ProductModelExtended[] | undefined; modalIsOpen: boolean; }) => void,
    addToWishList: (parameter: AddToWishListParameter) => void,
}) => {
    const { orderLine, order, wishListSettings, setAddToListModalIsOpen, addToWishList } = props;
    const toasterContext = React.useContext(ToasterContext);
    const addToListClickHandler = () => {
        if (!wishListSettings) {
            return;
        }

        const product = {
            id: orderLine.productId,
            qtyOrdered: orderLine.qtyOrdered,
            selectedUnitOfMeasure: orderLine.unitOfMeasure,
        } as ProductModelExtended;
        if (!wishListSettings.allowMultipleWishLists) {
            addToWishList({
                products: [product],
                onSuccess: () => {
                    toasterContext.addToast({ body: siteMessage("Lists_ProductAdded"), messageType: "success" });
                },
            });
            return;
        }

        setAddToListModalIsOpen({ modalIsOpen: true, products: [product] });
    };

    return (
        <GridContainer>
            <GridItem {...styles.orderLineCardImageGridItem}>
                {orderLine.productUri && orderLine.isActiveProduct
                    && <Link href={orderLine.productUri}>
                        <LazyImage {...styles.orderLineCardImage} src={orderLine.mediumImagePath} />
                    </Link>
                }
            </GridItem>
            <GridItem {...styles.orderLineCardInfoGridItem}>
                <GridContainer {...styles.orderLineCardInfoGridContainer}>
                    <ProductInfo orderLine={orderLine} />
                    <OrderLineInfo orderLine={orderLine} order={order} />
                    <OrderLineNotes extendedStyles={styles.orderLineNotes} orderLine={orderLine} />
                </GridContainer>
            </GridItem>
            <GridItem {...styles.orderLineCardAddToListGridItem}>
                <Hidden {...styles.orderLineCardActionsWide}>
                    <OverflowMenu {...styles.overflowMenu}>
                        <Clickable {...styles.addToListClickable} onClick={addToListClickHandler}>{translate("Add to List")}</Clickable>
                    </OverflowMenu>
                </Hidden>
                <Hidden {...styles.orderLineCardActionsNarrow}>
                    <Button {...styles.orderLineCardAddToListButton} onClick={addToListClickHandler}>{translate("Add to List")}</Button>
                </Hidden>
            </GridItem>
        </GridContainer>
    );
};

export const summaryTableStyles = styles;

const OrderDetailsSummaryTable: React.FunctionComponent<Props> = ({ order, wishListSettings, setAddToListModalIsOpen, addToWishList }) => {
    if (!order.value || !order.value.orderLines) {
        return null;
    }

    return (
        <GridContainer {...styles.gridContainer}>
            <GridItem width={12}>
                <Typography {...styles.titleText}>{translate("Order Summary")}</Typography>
            </GridItem>
            {order.value.orderLines.map(orderLine => (
                <CardContainer {...styles.orderLineCardContainer} key={orderLine.id}>
                    <GridItem width={12}>
                        <OrderLineCard
                            orderLine={orderLine}
                            order={order.value!}
                            wishListSettings={wishListSettings}
                            setAddToListModalIsOpen={setAddToListModalIsOpen}
                            addToWishList={addToWishList} />
                    </GridItem>
                </CardContainer>
            ))}
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderDetailsSummaryTable),
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
        fieldDefinitions: [],
    },
};

export default widgetModule;
