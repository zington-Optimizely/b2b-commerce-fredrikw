import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import setAddToListModalIsOpen from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import addToWishList, {
    AddToWishListParameter,
} from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import translate from "@insite/client-framework/Translate";
import { OrderLineModel, OrderModel, WishListSettingsModel } from "@insite/client-framework/Types/ApiModels";
import CardContainer from "@insite/content-library/Components/CardContainer";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    order?: OrderModel;
    extendedStyles?: OrderLinesListStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
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

export interface OrderLinesListStyles {
    gridContainer?: GridContainerProps;
    titleGridItem?: GridItemProps;
    titleText?: TypographyProps;
    orderLineCardContainer?: GridContainerProps;
    orderLineCardGridItem?: GridItemProps;
    orderLineCardGridContainer?: GridContainerProps;
    orderLineCardImageGridItem?: GridItemProps;
    productImageLink?: LinkPresentationProps;
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
    productInfoPartNumbersGridContainer?: GridContainerProps;
    productInfoSectionOptionsText?: InjectableCss;
    productInfoGridItem?: GridItemProps;
    productInfoGridContainer?: GridContainerProps;
    productInfoBrandDescriptionGridItem?: GridItemProps;
    productInfoBrandDescriptionGridContainer?: GridContainerProps;
    productInfoBrandGridItem?: GridItemProps;
    productInfoDescriptionGridItem?: GridItemProps;
    productDescriptionStyles?: ProductDescriptionStyles;
    productInfoErpNumberGridItem?: GridItemProps;
    erpNumberHeadingAndText?: SmallHeadingAndTextStyles;
    productInfoManufacturerItemGridItem?: GridItemProps;
    manufacturerHeadingAndText?: SmallHeadingAndTextStyles;
    productInfoCustomerProductGridItem?: GridItemProps;
    customerProductNumberHeadingAndText?: SmallHeadingAndTextStyles;
    orderLineInfoPromotionGridItem?: GridItemProps;
    orderLineInfoPromotionList?: InjectableCss;
    orderLineInfoPromotionText?: TypographyProps;
    orderLineInfoGridItem?: GridItemProps;
    orderLineInfoGridContainer?: GridContainerProps;
    orderLinePriceGridItem?: GridItemProps;
    priceHeadingAndText?: SmallHeadingAndTextStyles;
    productInfoQtyOrderedGridItem?: GridItemProps;
    productInfoQtyOrderedHeadingAndText?: SmallHeadingAndTextStyles;
    productInfoQtyShippedGridItem?: GridItemProps;
    productInfoQtyShippedHeadingAndText?: SmallHeadingAndTextStyles;
    productInfoSubtotalGridItem?: GridItemProps;
    productInfoSubtotalHeadingAndText?: SmallHeadingAndTextStyles;
    orderLineNotes?: OrderLineNotesStyles;
    productInfoTotalsGridItem?: GridItemProps;
    productInfoTotalsGridContainer?: GridContainerProps;
}

export const orderLinesListStyles: OrderLinesListStyles = {
    titleGridItem: {
        width: 12,
    },
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
    orderLineCardGridItem: {
        width: 12,
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

const OrderLineProductInfo = ({ orderLine, styles }: { orderLine: OrderLineModel; styles: OrderLinesListStyles }) => {
    let sectionOptions: JSX.Element[] = [];
    if (orderLine.sectionOptions && orderLine.sectionOptions) {
        sectionOptions = orderLine.sectionOptions.map(option => (
            <li {...styles.productInfoSectionOptionsListItem} key={option.sectionOptionId.toString()}>
                <Typography {...styles.productInfoSectionOptionsText}>
                    {option.sectionName}: {option.optionName}
                </Typography>
            </li>
        ));
    }

    return (
        <GridItem {...styles.productInfoGridItem}>
            <GridContainer {...styles.productInfoGridContainer}>
                <GridItem {...styles.productInfoBrandDescriptionGridItem}>
                    <GridContainer {...styles.productInfoBrandDescriptionGridContainer}>
                        {orderLine.brand && (
                            <GridItem {...styles.productInfoBrandGridItem}>
                                <ProductBrand brand={orderLine.brand} extendedStyles={styles.productBrandStyles} />
                            </GridItem>
                        )}
                        <GridItem {...styles.productInfoDescriptionGridItem}>
                            <ProductDescription product={orderLine} extendedStyles={styles.productDescriptionStyles} />
                        </GridItem>
                    </GridContainer>
                </GridItem>
                {sectionOptions.length > 0 && (
                    <GridItem {...styles.productInfoSectionOptionsGridItem}>
                        <ul {...styles.productInfoSectionOptionsList}>{sectionOptions}</ul>
                    </GridItem>
                )}
                <GridItem {...styles.productInfoPartNumbersGridItem}>
                    <GridContainer {...styles.productInfoPartNumbersGridContainer}>
                        <GridItem {...styles.productInfoErpNumberGridItem}>
                            <SmallHeadingAndText
                                {...styles.erpNumberHeadingAndText}
                                heading={translate("Item #")}
                                text={orderLine.productErpNumber}
                            />
                        </GridItem>
                        {orderLine.manufacturerItem && (
                            <GridItem {...styles.productInfoManufacturerItemGridItem}>
                                <SmallHeadingAndText
                                    {...styles.manufacturerHeadingAndText}
                                    heading={translate("MFG #")}
                                    text={orderLine.manufacturerItem}
                                />
                            </GridItem>
                        )}
                        {orderLine.customerProductNumber && (
                            <GridItem {...styles.productInfoCustomerProductGridItem}>
                                <SmallHeadingAndText
                                    {...styles.customerProductNumberHeadingAndText}
                                    heading={translate("My Part #")}
                                    text={orderLine.customerProductNumber}
                                />
                            </GridItem>
                        )}
                    </GridContainer>
                </GridItem>
            </GridContainer>
        </GridItem>
    );
};

const OrderLineInfo = ({
    orderLine,
    order,
    styles,
}: {
    orderLine: OrderLineModel;
    order: OrderModel;
    styles: OrderLinesListStyles;
}) => {
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
                    <SmallHeadingAndText
                        {...styles.priceHeadingAndText}
                        heading={translate("Price")}
                        text={
                            orderLine.unitPriceDisplay +
                            (orderLine.unitOfMeasure ? ` / ${orderLine.unitOfMeasure}` : "")
                        }
                    />
                </GridItem>
                {promotions.length > 0 && (
                    <GridItem {...styles.orderLineInfoPromotionList}>
                        <ul {...styles.orderLineInfoPromotionList}>{promotions}</ul>
                    </GridItem>
                )}
                <GridItem {...styles.productInfoTotalsGridItem}>
                    <GridContainer {...styles.productInfoTotalsGridContainer}>
                        <GridItem {...styles.productInfoQtyOrderedGridItem}>
                            <SmallHeadingAndText
                                {...styles.productInfoQtyOrderedHeadingAndText}
                                heading={translate("QTY Ordered")}
                                text={`${orderLine.qtyOrdered}`}
                            />
                        </GridItem>
                        <GridItem {...styles.productInfoQtyShippedGridItem}>
                            <SmallHeadingAndText
                                {...styles.productInfoQtyShippedHeadingAndText}
                                heading={translate("QTY Shipped")}
                                text={`${orderLine.qtyShipped}`}
                            />
                        </GridItem>
                        <GridItem {...styles.productInfoSubtotalGridItem}>
                            <SmallHeadingAndText
                                {...styles.productInfoSubtotalHeadingAndText}
                                heading={translate("Subtotal")}
                                text={orderLine.extendedUnitNetPriceDisplay}
                            />
                        </GridItem>
                    </GridContainer>
                </GridItem>
            </GridContainer>
        </GridItem>
    );
};

const OrderLineNotes = ({
    orderLine,
    extendedStyles,
}: {
    orderLine: OrderLineModel;
    extendedStyles?: OrderLineNotesStyles;
}) => {
    return orderLine.notes ? (
        <GridItem {...extendedStyles?.gridItemStyles}>
            <Typography {...extendedStyles?.typographyStyles}>{orderLine.notes}</Typography>
        </GridItem>
    ) : null;
};

const OrderLineCard = (props: {
    orderLine: OrderLineModel;
    order: OrderModel;
    wishListSettings?: WishListSettingsModel;
    styles: OrderLinesListStyles;
    setAddToListModalIsOpen: (parameter: {
        productInfos?: Omit<ProductInfo, "productDetailPath">[];
        modalIsOpen: boolean;
    }) => void;
    addToWishList: (parameter: AddToWishListParameter) => void;
}) => {
    const { orderLine, order, wishListSettings, styles, setAddToListModalIsOpen, addToWishList } = props;
    const toasterContext = React.useContext(ToasterContext);
    const addToListClickHandler = () => {
        if (!wishListSettings) {
            return;
        }

        const productInfo = {
            productId: orderLine.productId,
            qtyOrdered: orderLine.qtyOrdered,
            unitOfMeasure: orderLine.unitOfMeasure,
        };
        if (!wishListSettings.allowMultipleWishLists) {
            addToWishList({
                productInfos: [productInfo],
                onSuccess: () => {
                    toasterContext.addToast({ body: siteMessage("Lists_ProductAdded"), messageType: "success" });
                },
            });
            return;
        }

        setAddToListModalIsOpen({ modalIsOpen: true, productInfos: [productInfo] });
    };

    return (
        <GridContainer
            {...styles.orderLineCardGridContainer}
            data-test-selector={`orderLineCard${orderLine.productId}`}
        >
            <GridItem {...styles.orderLineCardImageGridItem}>
                {orderLine.productUri && orderLine.isActiveProduct && (
                    <Link {...styles.productImageLink} href={orderLine.productUri}>
                        <LazyImage {...styles.orderLineCardImage} src={orderLine.mediumImagePath} />
                    </Link>
                )}
            </GridItem>
            <GridItem {...styles.orderLineCardInfoGridItem}>
                <GridContainer {...styles.orderLineCardInfoGridContainer}>
                    <OrderLineProductInfo orderLine={orderLine} styles={styles} />
                    <OrderLineInfo orderLine={orderLine} order={order} styles={styles} />
                    <OrderLineNotes extendedStyles={styles.orderLineNotes} orderLine={orderLine} />
                </GridContainer>
            </GridItem>
            <GridItem {...styles.orderLineCardAddToListGridItem}>
                <Hidden {...styles.orderLineCardActionsWide}>
                    {orderLine.canAddToWishlist && (
                        <OverflowMenu position="end" {...styles.overflowMenu}>
                            <Clickable {...styles.addToListClickable} onClick={addToListClickHandler}>
                                {translate("Add to List")}
                            </Clickable>
                        </OverflowMenu>
                    )}
                </Hidden>
                <Hidden {...styles.orderLineCardActionsNarrow}>
                    {orderLine.canAddToWishlist && (
                        <Button {...styles.orderLineCardAddToListButton} onClick={addToListClickHandler}>
                            {translate("Add to List")}
                        </Button>
                    )}
                </Hidden>
            </GridItem>
        </GridContainer>
    );
};

const OrderLinesList: FC<Props> = ({
    order,
    wishListSettings,
    setAddToListModalIsOpen,
    addToWishList,
    extendedStyles,
}) => {
    const [styles] = React.useState(() => mergeToNew(orderLinesListStyles, extendedStyles));

    if (!order || !order.orderLines) {
        return null;
    }

    return (
        <GridContainer {...styles.gridContainer}>
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.titleText}>{translate("Order Summary")}</Typography>
            </GridItem>
            {order.orderLines.map(orderLine => (
                <CardContainer {...styles.orderLineCardContainer} key={orderLine.id}>
                    <GridItem {...styles.orderLineCardGridItem}>
                        <OrderLineCard
                            orderLine={orderLine}
                            order={order}
                            wishListSettings={wishListSettings}
                            styles={styles}
                            setAddToListModalIsOpen={setAddToListModalIsOpen}
                            addToWishList={addToWishList}
                        />
                    </GridItem>
                </CardContainer>
            ))}
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderLinesList);
