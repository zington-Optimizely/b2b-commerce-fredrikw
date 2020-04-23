import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import React, { useState } from "react";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps, TypographyProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import TokenExFrame, { TokenExFramePresentationProps } from "@insite/mobius/TokenExFrame";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import styled, { css } from "styled-components";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import Link from "@insite/mobius/Link";

interface OwnProps {
    canSaveCard?: boolean;
    useTokenExGateway?: boolean;
    saveCard: boolean;
    onSaveCardChange: (_: React.SyntheticEvent<Element, Event>, value: boolean) => void;
    cardHolderName: string;
    onCardHolderNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    cardHolderNameError?: string;
    cardNumber: string;
    onCardNumberChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    cardNumberError?: string;
    cardType: string;
    possibleCardType: string;
    onCardTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    cardTypeError?: string;
    expirationMonth: number;
    onExpirationMonthChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    expirationError?: string;
    expirationYear: number;
    onExpirationYearChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    securityCode: string;
    onSecurityCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    securityCodeError?: string;
    availableCardTypes: { key: string; value: string; }[];
    availableMonths: { key: string; value: number; }[];
    availableYears: { key: number; value: number; }[];
    extendedStyles?: CreditCardDetailsEntryStyles;
}

export interface CreditCardDetailsEntryStyles {
    creditCardDetailsContainer?: GridContainerProps;
    creditCardDetailsHeadingGridItem?: GridItemProps;
    creditCardDetailsHeading?: TypographyPresentationProps;
    saveCardGridItem?: GridItemProps;
    saveCardCheckboxGroup?: CheckboxGroupComponentProps;
    saveCardCheckbox?: CheckboxPresentationProps;
    cardHolderNameGridItem?: GridItemProps;
    cardHolderNameText?: TextFieldPresentationProps;
    cardNumberGridItem?: GridItemProps;
    cardNumberTokenExFrameWrapper?: InjectableCss;
    cardNumberTokenExFrame?: TokenExFramePresentationProps;
    cardNumberText?: TextFieldPresentationProps;
    cardTypeGridItem?: GridItemProps;
    cardTypeTokenExLabel?: TypographyPresentationProps;
    cardTypeTokenExText?: TypographyPresentationProps;
    cardTypeSelect?: SelectPresentationProps;
    expirationDateGridItem?: GridItemProps;
    expirationDateContainer?: GridContainerProps;
    expirationMonthGridItem?: GridItemProps;
    expirationMonthSelect?: SelectPresentationProps;
    expirationYearGridItem?: GridItemProps;
    expirationYearSelect?: SelectPresentationProps;
    securityCodeGridItem?: GridItemProps;
    securityCodeTokenExFrameWrapper?: InjectableCss;
    securityCodeTokenExFrame?: TokenExFramePresentationProps;
    securityCodeText?: TextFieldPresentationProps;
    securityCodeHelpModal?: ModalPresentationProps;
    securityCodeHelpModalImageWrapper?: InjectableCss;
    securityCodeHelpImage?: LazyImageProps;
}

export const creditCardDetailsEntryStyles: CreditCardDetailsEntryStyles = {
    creditCardDetailsContainer: { gap: 10 },
    creditCardDetailsHeadingGridItem: { width: 12 },
    creditCardDetailsHeading: { variant: "h5" },
    saveCardGridItem: { width: 12 },
    cardHolderNameGridItem: { width: 12 },
    cardNumberGridItem: { width: 12 },
    cardNumberTokenExFrameWrapper: {
        css: css` height: inherit; `,
    },
    cardTypeGridItem: {
        width: 12,
        css: css` flex-direction: column; `,
    },
    cardTypeTokenExLabel: { weight: 600 },
    expirationDateGridItem: { width: 12 },
    expirationDateContainer: { gap: 10 },
    expirationMonthGridItem: { width: 6 },
    expirationYearGridItem: { width: 6 },
    securityCodeGridItem: { width: 12 },
    securityCodeTokenExFrameWrapper: {
        css: css` height: inherit; `,
    },
    securityCodeHelpModalImageWrapper: {
        css: css`
            display: flex;
            justify-content: center;
        `,
    },
};

const CardNumberTokenExFrameWrapper = styled.div<InjectableCss>` ${({ css }) => css} `;
const SecurityCodeTokenExFrameWrapper = styled.div<InjectableCss>` ${({ css }) => css} `;
const SecurityCodeImageWrapper = styled.div<InjectableCss>` ${({ css }) => css} `;

const CreditCardDetailsEntry = ({
    useTokenExGateway,
    ...otherProps
}: OwnProps) => {
    const [isSecurityCodeModalOpen, setIsSecurityCodeModalOpen] = useState(false);
    const [styles] = React.useState(() => mergeToNew(creditCardDetailsEntryStyles, otherProps.extendedStyles));

    const handleSecurityCodeHelpLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        setIsSecurityCodeModalOpen(true);
    };

    const handleSecurityCodeModalClose = (_: React.SyntheticEvent<Element, Event>) => setIsSecurityCodeModalOpen(false);

    const securityCodeLabel = translate("Locate my card's security code");
    const securityCodeHint = <Link onClick={handleSecurityCodeHelpLinkClick}>{securityCodeLabel}</Link>;

    return (
        <GridContainer {...styles.creditCardDetailsContainer}>
            <GridItem {...styles.creditCardDetailsHeadingGridItem}>
                <Typography {...styles.creditCardDetailsHeading} as="h2">{translate("Credit Card Details")}</Typography>
            </GridItem>
            {otherProps.canSaveCard
                && <GridItem {...styles.saveCardGridItem}>
                    <CheckboxGroup {...styles.saveCardCheckboxGroup}>
                        <Checkbox
                            {...styles.saveCardCheckbox}
                            checked={otherProps.saveCard}
                            onChange={otherProps.onSaveCardChange}
                        >
                            {translate("Save card information")}
                        </Checkbox>
                    </CheckboxGroup>
                </GridItem>
            }
            <GridItem {...styles.cardHolderNameGridItem}>
                <TextField
                    {...styles.cardHolderNameText}
                    label={translate("Name on Card")}
                    value={otherProps.cardHolderName}
                    onChange={otherProps.onCardHolderNameChange}
                    required
                    maxLength={30}
                    error={otherProps.cardHolderNameError}
                    data-test-selector="checkoutReviewAndSubmit_cardHolderName"
                />
            </GridItem>
            <GridItem {...styles.cardNumberGridItem}>
                {useTokenExGateway
                    ? <TokenExFrame
                        {...styles.cardNumberTokenExFrame}
                        label={translate("Card Number")}
                        tokenExIFrameContainer={
                            <CardNumberTokenExFrameWrapper
                                {...styles.cardNumberTokenExFrameWrapper}
                                id="tokenExCardNumber"
                            ></CardNumberTokenExFrameWrapper>
                        }
                        required
                        error={otherProps.cardNumberError}
                        data-test-selector="checkoutReviewAndSubmit_cardNumber"
                    />
                    : <TextField
                        {...styles.cardNumberText}
                        label={translate("Card Number")}
                        value={otherProps.cardNumber}
                        onChange={otherProps.onCardNumberChange}
                        required
                        maxLength={16}
                        error={otherProps.cardNumberError}
                        data-test-selector="checkoutReviewAndSubmit_cardNumber"
                    />
                }
            </GridItem>
            <GridItem {...styles.cardTypeGridItem}>
                {useTokenExGateway
                    ? <>
                        <Typography
                            {...styles.cardTypeTokenExLabel}
                            id="cardTypeTokenEx"
                        >
                            {translate("Card Type")}
                        </Typography>
                        <TokenExCardTypeDisplay
                            {...styles.cardTypeTokenExText}
                            possibleCardType={otherProps.possibleCardType}
                            aria-labelledby="cardTypeTokenEx"
                        />
                    </>
                    : <Select
                        {...styles.cardTypeSelect}
                        label={translate("Card Type")}
                        value={otherProps.cardType}
                        onChange={otherProps.onCardTypeChange}
                        required
                        error={otherProps.cardTypeError}
                        data-test-selector="checkoutReviewAndSubmit_cardType"
                    >
                        <option value="">{translate("Select Card")}</option>
                        {otherProps.availableCardTypes.map(ct => (
                            <option key={ct.value} value={ct.value}>{ct.key}</option>
                        ))}
                    </Select>
                }
            </GridItem>
            <GridItem {...styles.expirationDateGridItem}>
                <GridContainer {...styles.expirationDateContainer}>
                    <GridItem {...styles.expirationMonthGridItem}>
                        <Select
                            {...styles.expirationMonthSelect}
                            label={translate("Expiration Month")}
                            value={otherProps.expirationMonth}
                            onChange={otherProps.onExpirationMonthChange}
                            required
                            error={otherProps.expirationError}
                            data-test-selector="checkoutReviewAndSubmit_expirationMonth"
                        >
                            {otherProps.availableMonths.map(month => (
                                <option key={month.value} value={month.value}>{month.key}</option>
                            ))}
                        </Select>
                    </GridItem>
                    <GridItem {...styles.expirationYearGridItem}>
                        <Select
                            {...styles.expirationYearSelect}
                            label={translate("Expiration Year")}
                            value={otherProps.expirationYear}
                            onChange={otherProps.onExpirationYearChange}
                            required
                            data-test-selector="checkoutReviewAndSubmit_expirationYear"
                        >
                            {otherProps.availableYears.map(year => (
                                <option key={year.value} value={year.value}>{year.key}</option>
                            ))}
                        </Select>
                    </GridItem>
                </GridContainer>
            </GridItem>
            <GridItem {...styles.securityCodeGridItem}>
                {useTokenExGateway
                    ? <TokenExFrame
                        {...styles.securityCodeTokenExFrame}
                        label={translate("Security Code")}
                        hint={securityCodeHint}
                        tokenExIFrameContainer={
                            <SecurityCodeTokenExFrameWrapper
                                {...styles.securityCodeTokenExFrameWrapper}
                                id="tokenExSecurityCode"
                            />
                        }
                        required
                        error={otherProps.securityCodeError}
                        data-test-selector="checkoutReviewAndSubmit_securityCode"
                    />
                    : <TextField
                        {...styles.securityCodeText}
                        label={translate("Security Code")}
                        hint={securityCodeHint}
                        value={otherProps.securityCode}
                        onChange={otherProps.onSecurityCodeChange}
                        required
                        minLength={3}
                        maxLength={4}
                        error={otherProps.securityCodeError}
                        data-test-selector="checkoutReviewAndSubmit_securityCode"
                    />
                }
                <Modal
                    headline={securityCodeLabel}
                    isOpen={isSecurityCodeModalOpen}
                    handleClose={handleSecurityCodeModalClose}
                    {...styles.securityCodeHelpModal}
                >
                    <SecurityCodeImageWrapper {...styles.securityCodeHelpModalImageWrapper}>
                        <LazyImage
                            src="/images/security_code_sample.jpg"
                            imgProps={{ width: 660, height: 264 }}
                            altText={translate("Location of security code on card")}
                            {...styles.securityCodeHelpImage}
                        />
                    </SecurityCodeImageWrapper>
                </Modal>
            </GridItem>
        </GridContainer>
    );
};

type TokenExCardTypeDisplayProps = TypographyProps & {
    possibleCardType: string;
};

const TokenExCardTypeDisplay = ({
    possibleCardType,
    ...otherProps
}: TokenExCardTypeDisplayProps) => {
    let cardTypeDisplay = "";
    if (possibleCardType === "masterCard") {
        cardTypeDisplay = "Mastercard";
    } else if (possibleCardType === "americanExpress") {
        cardTypeDisplay = "American Express";
    } else if (possibleCardType === "discover") {
        cardTypeDisplay = "Discover";
    } else if (possibleCardType === "visa") {
        cardTypeDisplay = "Visa";
    }
    return <Typography {...otherProps}>{cardTypeDisplay}</Typography>;
};

export default CreditCardDetailsEntry;
