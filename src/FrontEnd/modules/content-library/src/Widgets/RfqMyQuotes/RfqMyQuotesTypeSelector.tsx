import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { QuoteType } from "@insite/client-framework/Services/QuoteService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import updateSearchFields from "@insite/client-framework/Store/Pages/RfqMyQuotes/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqMyQuotesPageContext } from "@insite/content-library/Pages/RfqMyQuotesPage";
import Radio, { RadioComponentProps } from "@insite/mobius/Radio";
import RadioGroup, { RadioGroupProps } from "@insite/mobius/RadioGroup";
import FieldSetPresentationProps from "@insite/mobius/utilities/fieldSetProps";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { ChangeEvent, FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    parameter: state.pages.rfqMyQuotes.getQuotesParameter,
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & WidgetProps;

export interface RfqMyQuotesTypeSelectorStyles {
    wrapper?: InjectableCss;
    quoteTypeRadioGroup?: RadioGroupProps;
    quoteTypeRadioButton?: FieldSetPresentationProps<RadioComponentProps>;
}

export const rfqMyQuotesTypeSelectorStyles: RfqMyQuotesTypeSelectorStyles = {
    quoteTypeRadioGroup: {
        // TODO ISC-12425 set these radio buttons to horizontal and remove the  "& > div" selector
        css: css`
            display: inline-block;
            padding-bottom: 20px;
            width: 100%;
            flex-direction: row;
            & > div {
                margin-right: 20px;
                display: inline-flex;
            }
        `,
    },
};

const styles = rfqMyQuotesTypeSelectorStyles;

const RfqMyQuotesTypeSelector: FC<Props> = ({ parameter, updateSearchFields }) => {
    const quoteTypeChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        updateSearchFields({ types: event.currentTarget.value as QuoteType });
    };

    return (
        <StyledWrapper {...styles.wrapper}>
            <RadioGroup
                {...styles.quoteTypeRadioGroup}
                value={parameter.types}
                onChangeHandler={quoteTypeChangeHandler}
                data-test-selector="requestQuoteTypeRadio"
            >
                <Radio {...styles.quoteTypeRadioButton} value="quote">
                    {translate("Sales Quotes")}
                </Radio>
                <Radio {...styles.quoteTypeRadioButton} value="job">
                    {translate("Job Quotes")}
                </Radio>
            </RadioGroup>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqMyQuotesTypeSelector),
    definition: {
        group: "RFQ My Quotes",
        displayName: "Quote Type Selector",
        allowedContexts: [RfqMyQuotesPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
