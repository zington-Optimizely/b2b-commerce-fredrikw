import React from "react";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import RadioGroup, { RadioGroupComponentProps } from "@insite/mobius/RadioGroup";
import Radio, { RadioComponentProps, RadioStyle } from "@insite/mobius/Radio";
import translate from "@insite/client-framework/Translate";
import FieldSetPresentationProps, { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
import setFulfillmentMethod from "@insite/client-framework/Store/Context/Handlers/SetFulfillmentMethod";
import { css } from "styled-components";
import { CheckoutShippingPageContext } from "@insite/content-library/Pages/CheckoutShippingPage";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    fulfillmentMethod: state.context.session.fulfillmentMethod,
    enableWarehousePickup: getSettingsCollection(state).accountSettings.enableWarehousePickup,
});

const mapDispatchToProps = {
    setFulfillmentMethod,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutShippingFulfillmentMethodSelectorStyles {
    container?: GridContainerProps;
    gridItem?: GridItemProps;
    headingText?: TypographyPresentationProps;
    radioGroup?: FieldSetGroupPresentationProps<RadioGroupComponentProps>;
    shipRadio?: FieldSetPresentationProps<RadioComponentProps>;
    pickUpRadio?: FieldSetPresentationProps<RadioComponentProps>;
}

const styles: CheckoutShippingFulfillmentMethodSelectorStyles = {
    gridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    headingText: { variant: "h5" },
    radioGroup: {
        css: css`
            display: block;
            ${RadioStyle} {
                display: inline-block;
                margin-right: 1em;
                & + ${RadioStyle} {
                    margin-top: 0;
                }
            }
        `,
    },
};

export const checkoutShippingFulfillmentMethodStyles = styles;

const CheckoutShippingFulfillmentMethodSelector = ({
    fulfillmentMethod,
    enableWarehousePickup,
    setFulfillmentMethod,
}: Props) => {
    if (!fulfillmentMethod || !enableWarehousePickup) {
        return null;
    }

    const handleChangeFulfillmentMethod = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFulfillmentMethod({ fulfillmentMethod: event.currentTarget.value as "Ship" | "PickUp" });
    };

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.gridItem}>
                <Typography {...styles.headingText} as="h2">{translate("Fulfillment Method")}</Typography>
                <RadioGroup
                    {...styles.radioGroup}
                    value={fulfillmentMethod}
                    onChangeHandler={handleChangeFulfillmentMethod}
                >
                    <Radio
                        {...styles.shipRadio}
                        value="Ship"
                        data-test-selector="fulfillmentMethod_ship"
                    >
                        {translate("Ship to address")}
                    </Radio>
                    <Radio
                        {...styles.pickUpRadio}
                        value="PickUp"
                        data-test-selector="fulfillmentMethod_pickUp"
                    >
                        {translate("Pick Up")}
                    </Radio>
                </RadioGroup>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CheckoutShippingFulfillmentMethodSelector),
    definition: {
        group: "Checkout - Shipping",
        displayName: "Fulfillment Method Selector",
        allowedContexts: [CheckoutShippingPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
