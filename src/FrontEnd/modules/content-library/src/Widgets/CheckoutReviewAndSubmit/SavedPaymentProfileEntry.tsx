import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import translate from "@insite/client-framework/Translate";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import TokenExFrame, { TokenExFramePresentationProps } from "@insite/mobius/TokenExFrame";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import styled, { css } from "styled-components";

interface OwnProps {
    useTokenExGateway?: boolean;
    securityCode: string;
    onSecurityCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    securityCodeError?: string;
    extendedStyles?: SavedPaymentProfileEntryStyles;
}

export interface SavedPaymentProfileEntryStyles {
    text?: TextFieldPresentationProps;
    tokenExFrameWrapper?: InjectableCss;
    tokenExFrame?: TokenExFramePresentationProps;
    securityCodeHelpModal?: ModalPresentationProps;
    securityCodeHelpModalImageWrapper?: InjectableCss;
    securityCodeHelpImage?: LazyImageProps;
}

export const savedPaymentProfileEntryStyles: SavedPaymentProfileEntryStyles = {
    tokenExFrameWrapper: {
        css: css`
            height: inherit;
        `,
    },
    securityCodeHelpModalImageWrapper: {
        css: css`
            display: flex;
            justify-content: center;
        `,
    },
};

const TokenExFrameWrapper = styled.div<InjectableCss>`
    ${({ css }) => css}
`;
const SecurityCodeImageWrapper = styled.div<InjectableCss>`
    ${({ css }) => css}
`;

const SavedPaymentProfileEntry = (props: OwnProps) => {
    const [styles] = useState(() => mergeToNew(savedPaymentProfileEntryStyles, props.extendedStyles));
    const [isSecurityCodeModalOpen, setIsSecurityCodeModalOpen] = useState(false);

    const handleSecurityCodeHelpLinkClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        setIsSecurityCodeModalOpen(true);
    };

    const handleSecurityCodeModalClose = (_: React.SyntheticEvent<Element, Event>) => setIsSecurityCodeModalOpen(false);

    const securityCodeHelpLabel = translate("Locate my card's security code");
    const securityCodeHint = <Link onClick={handleSecurityCodeHelpLinkClick}>{securityCodeHelpLabel}</Link>;

    return (
        <>
            {props.useTokenExGateway ? (
                <TokenExFrame
                    {...styles.tokenExFrame}
                    label={translate("Security Code")}
                    hint={securityCodeHint}
                    tokenExIFrameContainer={
                        <TokenExFrameWrapper {...styles.tokenExFrameWrapper} id="ppTokenExSecurityCode" />
                    }
                    required
                    error={props.securityCodeError}
                    data-test-selector="checkoutReviewAndSubmit_securityCode"
                />
            ) : (
                <TextField
                    {...styles.text}
                    label={translate("Security Code")}
                    hint={securityCodeHint}
                    value={props.securityCode}
                    onChange={props.onSecurityCodeChange}
                    required
                    minLength={3}
                    maxLength={4}
                    error={props.securityCodeError}
                    data-test-selector="checkoutReviewAndSubmit_securityCode"
                />
            )}
            <Modal
                headline={securityCodeHelpLabel}
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
        </>
    );
};

export default SavedPaymentProfileEntry;
