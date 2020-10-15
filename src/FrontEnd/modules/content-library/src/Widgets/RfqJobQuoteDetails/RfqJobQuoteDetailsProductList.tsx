import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getCurrentPageJobQuoteState,
    getCurrentPageOrderTotal,
    getQtyOrderedByJobQuoteLineId,
} from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesSelector";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedCurrency from "@insite/content-library/Components/LocalizedCurrency";
import { RfqJobQuoteDetailsPageContext } from "@insite/content-library/Pages/RfqJobQuoteDetailsPage";
import RfqJobQuoteDetailsProductCard from "@insite/content-library/Widgets/RfqJobQuoteDetails/RfqJobQuoteDetailsProductCard";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    jobQuoteState: getCurrentPageJobQuoteState(state),
    qtyOrderedByJobQuoteLineId: getQtyOrderedByJobQuoteLineId(state),
    orderTotal: getCurrentPageOrderTotal(state),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RfqJobQuoteDetailsProductListStyles {
    mainWrapper?: InjectableCss;
    headerWrapper?: InjectableCss;
    countLabelText?: TypographyPresentationProps;
    countValueText?: TypographyPresentationProps;
    footerWrapper?: InjectableCss;
    totalLabelText?: TypographyPresentationProps;
    totalValueText?: TypographyPresentationProps;
}

export const rfqJobQuoteDetailsProductListStyles: RfqJobQuoteDetailsProductListStyles = {
    headerWrapper: {
        css: css`
            padding-bottom: 15px;
            border-bottom: 1px solid ${getColor("common.border")};
        `,
    },
    countLabelText: {
        weight: 600,
        css: css`
            margin-left: 5px;
        `,
    },
    countValueText: {
        weight: 600,
    },
    footerWrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        `,
    },
    totalLabelText: {
        size: 20,
        weight: "bold",
    },
    totalValueText: {
        size: 20,
        css: css`
            margin-left: 10px;
        `,
    },
};

const styles = rfqJobQuoteDetailsProductListStyles;

const RfqJobQuoteDetailsProductList = ({ jobQuoteState, orderTotal }: Props) => {
    const jobQuote = jobQuoteState.value;
    if (!jobQuote || !jobQuote.jobQuoteLineCollection) {
        return null;
    }

    return (
        <StyledWrapper {...styles.mainWrapper}>
            <StyledWrapper {...styles.headerWrapper}>
                <Typography {...styles.countValueText} as="h2">
                    {jobQuote.jobQuoteLineCollection.length}
                    <Typography {...styles.countLabelText} as="span">
                        {translate(jobQuote.jobQuoteLineCollection.length > 1 ? "Products" : "Product")}
                    </Typography>
                </Typography>
            </StyledWrapper>
            {jobQuote.jobQuoteLineCollection.map(jobQuoteLine => (
                <RfqJobQuoteDetailsProductCard
                    key={`${jobQuoteLine.productId}_${jobQuoteLine.unitOfMeasure}`}
                    jobQuoteLine={jobQuoteLine}
                    isEditable={jobQuote.isEditable}
                    showLineNotes={jobQuote.showLineNotes}
                    currencySymbol={jobQuote.currencySymbol}
                />
            ))}
            <StyledWrapper {...styles.footerWrapper}>
                <Typography {...styles.totalLabelText}>
                    {translate("Total")}
                    <Typography {...styles.totalValueText}>
                        <LocalizedCurrency amount={orderTotal} />
                    </Typography>
                </Typography>
            </StyledWrapper>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RfqJobQuoteDetailsProductList),
    definition: {
        displayName: "Product List",
        allowedContexts: [RfqJobQuoteDetailsPageContext],
        group: "RFQ Job Quote Details",
    },
};

export default widgetModule;
