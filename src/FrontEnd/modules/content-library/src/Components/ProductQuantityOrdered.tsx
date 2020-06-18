import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import * as React from "react";
import translate from "@insite/client-framework/Translate";
import TextField, { TextFieldProps, TextFieldPresentationProps } from "@insite/mobius/TextField";
import { css } from "styled-components";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { connect } from "react-redux";

interface OwnProps extends TextFieldProps {
    product: ProductModelExtended;
    quantity: number;
    configurationCompleted?: boolean;
    variantSelectionCompleted?: boolean;
    onChangeHandler?: (value: string) => void;
    onBlurHandler?: (value: string) => void;
    labelOverride?: React.ReactNode;
    extendedStyles?: TextFieldPresentationProps;
}

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export const productQuantityOrderedStyles: TextFieldPresentationProps = {
    cssOverrides: {
        formInputWrapper: css`
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
                /* ISC-11023 deal with this. */
                /* stylelint-disable-next-line */
                -webkit-appearance: none;
                margin: 0;
            }
        `,
        inputSelect: css`
            /* ISC-11023 deal with this. */
            /* stylelint-disable-next-line */
            -moz-appearance: textfield;
        `,
    },
};

const ProductQuantityOrdered: React.FC<Props> = ({
    productSettings,
    product,
    quantity,
    configurationCompleted,
    variantSelectionCompleted,
    onChangeHandler,
    onBlurHandler,
    labelOverride,
    extendedStyles,
    ...otherProps
}) => {
    const [styles] = React.useState(() => mergeToNew(productQuantityOrderedStyles, extendedStyles));
    const [productQty, setProductQty] = React.useState(quantity.toString());

    React.useEffect(() => {
        if (quantity === Number(productQty)) {
            return;
        }
        setProductQty(`${quantity || ""}`);
    }, [quantity]);

    if (!productSettings || !productSettings.canAddToCart) {
        return null;
    }

    const isEnoughInventory = productSettings.allowBackOrder || !product.trackInventory || (product.qtyOnHand && product.qtyOnHand > 0);
    if (!isEnoughInventory) {
        return null;
    }

    const showQtyInput = product.canAddToCart
        || (product.canConfigure && configurationCompleted)
        || (!product.canConfigure && variantSelectionCompleted);

    if (!showQtyInput) {
        return null;
    }

    const keyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.which === 13) {
            (event.target as any).blur();
        }
    };

    const qtyChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setProductQty(value);
        if (onChangeHandler) {
            onChangeHandler(value);
        }
    };

    const qtyBlurHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (onBlurHandler) {
            onBlurHandler(event.target.value);
        }
    };

    return <TextField
        label={labelOverride ?? translate("QTY_quantity")}
        value={productQty}
        type="number"
        min={0}
        data-test-selector="product_qtyOrdered"
        {...otherProps}
        onKeyPress={keyPressHandler}
        onBlur={qtyBlurHandler}
        onChange={qtyChangeHandler}
        {...styles} />;
};

export default connect(mapStateToProps)(ProductQuantityOrdered);
