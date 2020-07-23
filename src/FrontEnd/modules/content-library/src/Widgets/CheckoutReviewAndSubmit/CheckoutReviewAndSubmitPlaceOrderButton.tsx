import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import React, { FC } from "react";
import { connect } from "react-redux";

interface OwnProps {
    styles?: ButtonPresentationProps;
}

const mapStateToProps = (state: ApplicationState) => {
    const cartState = getCurrentCartState(state);
    const { isPlacingOrder, isCheckingOutWithPayPay } = state.pages.checkoutReviewAndSubmit;
    return {
        isDisabled: cartState.isLoading || isPlacingOrder || isCheckingOutWithPayPay || cartState.value?.hasInsufficientInventory === true,
    };
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const CheckoutReviewAndSubmitPlaceOrderButton: FC<Props> = ({ isDisabled, styles }) => {
    const handleClick = () => {
        document.getElementById("reviewAndSubmitPaymentForm-submit")?.click();
    };
    return (
        <Button
            type="submit"
            disabled={isDisabled}
            data-test-selector="checkoutReviewAndSubmit_placeOrder"
            {...styles}
            onClick={handleClick}
        >
            {translate("Place Order")}
        </Button>
    );
};

export default connect(mapStateToProps)(CheckoutReviewAndSubmitPlaceOrderButton);
