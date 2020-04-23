import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import translate from "@insite/client-framework/Translate";
import { ProductPriceDto } from "@insite/client-framework/Types/ApiModels";
import getLocalizedCurrency from "@insite/client-framework/Common/Utilities/getLocalizedCurrency";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { connect } from "react-redux";

type OwnProps = TypographyPresentationProps & {
    pricing: ProductPriceDto;
    showSavingsAmount: boolean;
    showSavingsPercent: boolean;
    currencySymbol: string;
};

const mapStateToProps = (state: ApplicationState) => ({
    language: state.context.session.language,
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

const ProductPriceSavingsMessage: FC<Props> = ({
    pricing,
    showSavingsAmount,
    showSavingsPercent,
    currencySymbol,
    language,
    ...otherProps
}) => {
    const hasPriceSavings = pricing.unitNetPrice < pricing.unitListPrice;
    if (!language || !pricing || !hasPriceSavings) {
        return null;
    }

    let message = translate("Regular Price: {0}");
    const savingsAmount = Math.round((pricing.unitListPrice - pricing.unitNetPrice) * 100) / 100;
    const savingsPercent = Math.round((savingsAmount / pricing.unitListPrice) * 100);

    if (showSavingsAmount && showSavingsPercent) {
        message = translate("Regular Price: {0}, you save {1} ({2}%)")
            .replace("{0}", pricing.unitListPriceDisplay)
            .replace("{1}", getLocalizedCurrency({
                amount: savingsAmount,
                language,
                currencySymbol,
            }))
            .replace("{2}", `${savingsPercent}`);
    } else if (showSavingsPercent) {
        message = translate("Regular Price: {0}, you save {1}%")
            .replace("{0}", pricing.unitListPriceDisplay)
            .replace("{1}", `${savingsPercent}`);
    } else if (showSavingsAmount) {
        message = translate("Regular Price: {0}, you save {1}")
            .replace("{0}", pricing.unitListPriceDisplay)
            .replace("{1}", getLocalizedCurrency({
                amount: savingsAmount,
                language,
                currencySymbol,
            }));
    } else {
        message = message.replace("{0}", pricing.unitListPriceDisplay);
    }

    return (<Typography {...otherProps} data-test-selector="productPriceSavingsMessage">
        {message}
    </Typography>);
};

export default connect(mapStateToProps)(ProductPriceSavingsMessage);
