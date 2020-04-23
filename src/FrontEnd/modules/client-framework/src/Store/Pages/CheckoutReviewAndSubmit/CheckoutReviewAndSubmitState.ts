export default interface CheckoutReviewAndSubmitState {
    isPlacingOrder: boolean;
    isApplyingPromotion: boolean;
    promotionSuccessMessage?: string;
    promotionErrorMessage?: string;
    isCheckingOutWithPayPay: boolean;
    payPalRedirectUri?: string;
    requestedDeliveryDate?: Date | null;
    requestedPickupDate?: Date | null;
}
