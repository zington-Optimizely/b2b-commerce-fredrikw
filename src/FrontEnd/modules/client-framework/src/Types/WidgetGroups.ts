/**
 * Contains the pre-defined widget groups in the order they're displayed in the Shell UI.
 */
const WidgetGroups = [
    "Testing",
    "Basic",
    "Common",
    "Categories",
    "Header",
    "Catalog",
    "Products",
    "Product Details",
    "Order History",
    "Order Details",
    "Request RMA",
    "My Account",
    "Wish Lists",
    "RFQ",
    "Addresses",
    "My Lists",
    "Cart",
    "My Lists Details",
    "Account Settings",
    "Checkout - Shipping",
    "Invoice History",
    "Checkout - Review & Submit",
    "Sign In",
    "Product List",
    "Order Confirmation",
    "Invoice Details",
    "Change Password",
    "Brands",
    "Brand Details",
    "Saved Payments",
    "Create Account",
    "Order Upload",
    "Quick Order",
    "Footer",
    "Reset Password",
    "Change Customer",
] as const;

export default WidgetGroups;

/** Pre-defined widget groups for display in the Shell UI. */
export type WidgetGroup = typeof WidgetGroups[number];
