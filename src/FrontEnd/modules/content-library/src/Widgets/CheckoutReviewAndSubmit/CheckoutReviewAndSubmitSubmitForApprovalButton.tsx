import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import placeOrderForApproval from "@insite/client-framework/Store/Pages/CheckoutReviewAndSubmit/Handlers/PlaceOrderForApproval";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps {
    extendedStyles?: ButtonPresentationProps;
}

const mapStateToProps = (state: ApplicationState) => {
    const { isPlacingOrder } = state.pages.checkoutReviewAndSubmit;
    return {
        isDisabled: isPlacingOrder,
        orderApprovalDetailsLink: getPageLinkByPageType(state, "OrderApprovalDetailsPage"),
    };
};

const mapDispatchToProps = {
    placeOrderForApproval,
};

export interface SubmitForApprovalButtonStyles {
    submitForApprovalButton?: ButtonPresentationProps;
}

export const submitForApprovalButtonStyles: SubmitForApprovalButtonStyles = {};

const styles = submitForApprovalButtonStyles;

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasHistory &
    HasToasterContext;

const CheckoutReviewAndSubmitSubmitForApprovalButton = ({
    isDisabled,
    placeOrderForApproval,
    orderApprovalDetailsLink,
    history,
    toaster,
    extendedStyles,
}: Props) => {
    const handleClick = () => {
        placeOrderForApproval({
            onSuccess: (cartId: string) => {
                if (orderApprovalDetailsLink) {
                    history.push(`${orderApprovalDetailsLink.url}?cartId=${cartId}`);
                } else {
                    toaster.addToast({
                        body: translate("Order approval details page doesn't exist."),
                        messageType: "danger",
                    });
                }
            },
        });
    };

    return (
        <Button
            type="submit"
            disabled={isDisabled}
            data-test-selector="checkoutReviewAndSubmit_submitForApproval"
            {...extendedStyles}
            onClick={handleClick}
        >
            {translate("Submit For Approval")}
        </Button>
    );
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withToaster(withHistory(CheckoutReviewAndSubmitSubmitForApprovalButton)));
