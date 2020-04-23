import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import { CartLineModel } from "@insite/client-framework/Types/ApiModels";
import ProductPriceSavingsMessage from "@insite/content-library/Components/ProductPriceSavingsMessage";
import Tooltip, { TooltipPresentationProps } from "@insite/mobius/Tooltip";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";
import wrapInContainerStyles from "@insite/client-framework/Common/wrapInContainerStyles";

interface OwnProps {
    product: ProductModelExtended | CartLineModel;
    currencySymbol?: string;
    showLabel?: boolean;
    showSavings?: boolean;
    showSavingsAmount?: boolean;
    showSavingsPercent?: boolean;
    extendedStyles?: ProductPriceStyles;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    currencySymbol: ownProps.currencySymbol ?? state.context.session.currency?.currencySymbol ?? "",
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface ProductPriceStyles {
    wrapper?: any;
    priceLabelText?: TypographyPresentationProps;
    quoteMessageWrapper?: InjectableCss;
    quoteMessage?: RequiresQuoteMessageStyle;
    priceWrapper?: InjectableCss;
    price?: PriceStyles;
    packWrapper?: InjectableCss;
    packLabelText?: TypographyPresentationProps;
    packDescriptionText?: TypographyPresentationProps;
    savingsMessageText?: TypographyPresentationProps;
}

interface RequiresQuoteMessageStyle {
    text?: TypographyPresentationProps;
    tooltip?: TooltipPresentationProps;
}

interface PriceStyles {
    priceText?: TypographyPresentationProps;
    errorText?: TypographyPresentationProps;
    realTimeText?: TypographyPresentationProps;
    unitOfMeasureText?: TypographyPresentationProps;
    qtyPerBaseUnitOfMeasureText?: TypographyPresentationProps;
}

export const productPriceStyles: ProductPriceStyles = {
    wrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            width: 100%;
        `,
    },
    priceLabelText: {
        variant: "legend",
    },
    priceWrapper: {
        css: css`
            ${wrapInContainerStyles}
        `,
    },
    price: {
        priceText: { weight: "bold" },
        errorText: { weight: "bold" },
        realTimeText: {
            weight: "bold",
            css: css`
                display: inline-block;
                text-align: left;
                min-width: 25px;

                &::after {
                    overflow: hidden;
                    display: inline-block;
                    vertical-align: bottom;
                    animation: ellipsis steps(4, end) 900ms infinite 1s;
                    content: "\\2026";
                    width: 0;
                }

                @keyframes ellipsis {
                    to {
                        width: 1.25em;
                    }
                }
            `,
        },
    },
    packWrapper: {
        css: css` margin-bottom: 8px; `,
    },
    packLabelText: {
        weight: "bold",
    },
    savingsMessageText: {
        italic: true,
        size: "12px",
    },
    quoteMessage: {
        text: { weight: "bold" },
    },
};

const SectionWrapper = getStyledWrapper("section");

const ProductPrice: FC<Props> = ({
                                     product,
                                     currencySymbol,
                                     showLabel = true,
                                     showSavings = false,
                                     showSavingsAmount = false,
                                     showSavingsPercent = false,
                                     extendedStyles,
                                 }) => {
    const [styles] = React.useState(() => mergeToNew(productPriceStyles, extendedStyles));

    const { pricing, quoteRequired } = product;
    const unitOfMeasure = product.unitOfMeasureDescription || product.unitOfMeasureDisplay;
    const showQtyPerBaseUnitOfMeasure = "baseUnitOfMeasure" in product
        && product.unitOfMeasure !== product.baseUnitOfMeasure && product.qtyPerBaseUnitOfMeasure > 0;

    const quoteStyles = styles.quoteMessage || {};
    const priceStyles = styles.price || {};

    if ((product as ProductModelExtended).failedToLoadPricing) {
        return (
            <SectionWrapper {...styles.wrapper}>
                <Typography {...priceStyles.errorText}>{siteMessage("RealTimePricing_PriceLoadFailed")}</Typography>
            </SectionWrapper>
        );
    }

    return (
        <SectionWrapper {...styles.wrapper}>
            {showLabel
            && <Typography {...styles.priceLabelText}>{translate("Price")}</Typography>
            }
            {quoteRequired
            && <StyledWrapper {...styles.quoteMessageWrapper}>
                <Typography {...quoteStyles.text} data-test-selector="quoteRequiredText">{translate("Requires Quote")}</Typography>
                <Tooltip {...quoteStyles.tooltip} text={siteMessage("Rfq_TooltipMessage").toString()}/>
            </StyledWrapper>
            }
            {!quoteRequired
            && <>
                <StyledWrapper {...styles.priceWrapper}>
                    {pricing
                        ? <Typography
                            {...priceStyles.priceText}
                            data-test-selector="productPrice_unitNetPrice"
                        >
                            {pricing.unitNetPriceDisplay}
                        </Typography>
                        : <Typography
                            {...priceStyles.realTimeText}
                            data-test-selector="productPrice_unitNetPrice"
                        >{currencySymbol}
                        </Typography>
                    }
                    {unitOfMeasure
                    && <Typography
                        {...priceStyles.unitOfMeasureText}
                        data-test-selector="productPrice_unitOfMeasureLabel"
                    >
                        &nbsp;/&nbsp;{unitOfMeasure}
                    </Typography>
                    }
                </StyledWrapper>
                {showQtyPerBaseUnitOfMeasure && "baseUnitOfMeasure" in product
                && <Typography {...priceStyles.qtyPerBaseUnitOfMeasureText}>
                    {`${product.qtyPerBaseUnitOfMeasure} ${product.baseUnitOfMeasureDisplay} / ${unitOfMeasure}`}
                </Typography>
                }
                {"packDescription" in product && product.packDescription
                && <StyledWrapper {...styles.packWrapper}>
                    <Typography {...styles.packLabelText}>{translate("Pack")}:&nbsp;</Typography>
                    <Typography {...styles.packDescriptionText}>{product.packDescription}</Typography>
                </StyledWrapper>
                }
                {pricing && showSavings
                && <ProductPriceSavingsMessage
                    pricing={pricing}
                    showSavingsAmount={showSavingsAmount}
                    showSavingsPercent={showSavingsPercent}
                    currencySymbol={currencySymbol}
                    {...styles.savingsMessageText} />
                }
            </>
            }
        </SectionWrapper>
    );
};

export default connect(mapStateToProps)(ProductPrice);
