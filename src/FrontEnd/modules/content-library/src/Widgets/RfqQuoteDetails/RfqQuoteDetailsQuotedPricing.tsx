import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import { BreakPriceDto, QuoteLineModel, QuoteModel } from "@insite/client-framework/Types/ApiModels";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { useState } from "react";
import { css } from "styled-components";

interface OwnProps {
    quote: QuoteModel;
    quoteLine: QuoteLineModel;
    extendedStyles?: RfqQuoteDetailsQuotedPricingStyles;
}

export interface RfqQuoteDetailsQuotedPricingStyles {
    table?: DataTableProps;
    row?: DataTableRowProps;
    quantityCell?: DataTableCellProps;
    quantityText?: TypographyPresentationProps;
    priceCell?: DataTableCellProps;
    priceText?: TypographyPresentationProps;
}

export const rfqQuoteDetailsQuotedPricingStyles: RfqQuoteDetailsQuotedPricingStyles = {
    row: {
        evenRowCss: css` background: transparent; `,
    },
    quantityCell: {
        css: css`
            border: none;
            height: 30px;
        `,
    },
    priceCell: {
        css: css`
            border: none;
            height: 30px;
        `,
    },
};

const baseStyles = rfqQuoteDetailsQuotedPricingStyles;

const RfqQuoteDetailsQuotedPricing = ({
    quote,
    quoteLine,
    extendedStyles,
}: OwnProps) => {
    const [styles] = useState(() => mergeToNew(baseStyles, extendedStyles));

    const getBreakQtyText = (quoteLine: QuoteLineModel, breakPrices: BreakPriceDto[], breakPrice: BreakPriceDto, index: number) => {
        if (index !== breakPrices.length - 1) {
            return `${breakPrice.breakQty} - ${breakPrices[index + 1].breakQty - 1}`;
        }

        if (quoteLine.maxQty > 0) {
            return `${breakPrice.breakQty} - ${quoteLine.maxQty}`;
        }

        return `${breakPrice.breakQty}+`;
    };

    const renderRow = (qty: string, price: string) => {
        return <DataTableRow key={qty} {...styles.row}>
            <DataTableCell {...styles.quantityCell}>
                <VisuallyHidden>{translate("Quantity")}</VisuallyHidden>
                <Typography {...styles.quantityText}>{qty}</Typography>
            </DataTableCell>
            <DataTableCell {...styles.priceCell}>
                <VisuallyHidden>{translate("Price")}</VisuallyHidden>
                <Typography {...styles.priceText}>{price}</Typography>
            </DataTableCell>
        </DataTableRow>;
    };

    const renderRows = () => {
        if (quote.isJobQuote) {
            return renderRow(quoteLine.qtyOrdered!.toString(), quoteLine.pricing!.unitNetPriceDisplay);
        }

        if (!quoteLine.pricing?.unitRegularBreakPrices || quoteLine.pricing!.unitRegularBreakPrices.length === 0) {
            return renderRow("1+", quoteLine.pricing!.unitNetPriceDisplay);
        }

        const breakPrices = quoteLine.pricing.unitRegularBreakPrices;

        return <>
            {breakPrices.map((breakPrice, index) => {
                const breakQtyText = getBreakQtyText(quoteLine, breakPrices, breakPrice, index);
                return renderRow(breakQtyText, breakPrice.breakPriceDisplay);
            })}
        </>;
    };

    return <DataTable {...styles.table}>
        {renderRows()}
    </DataTable>;
};

export default RfqQuoteDetailsQuotedPricing;
