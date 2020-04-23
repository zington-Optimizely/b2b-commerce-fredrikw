import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import * as React from "react";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { css } from "styled-components";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import shareProduct from "@insite/client-framework/Store/CommonHandlers/ShareProduct";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";

interface OwnProps extends HasProductContext {
    text?: string;
    extendedStyles?: ProductShareLinkStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    session: state.context.session,
});

const mapDispatchToProps = {
    shareProduct,
};

export interface ProductShareLinkStyles {
    link?: LinkPresentationProps;
    modal?: ModalPresentationProps;
    container?: GridContainerProps;
    recipientNameGridItem?: GridItemProps;
    recipientNameTextField?: TextFieldProps;
    recipientEmailGridItem?: GridItemProps;
    recipientEmailTextField?: TextFieldProps;
    yourNameGridItem?: GridItemProps;
    yourNameTextField?: TextFieldProps;
    yourEmailGridItem?: GridItemProps;
    yourEmailTextField?: TextFieldProps;
    yourMessageGridItem?: GridItemProps;
    yourMessageTextArea?: TextAreaProps;
    buttonsWrapper?: InjectableCss;
    cancelButton?: ButtonPresentationProps;
    shareButton?: ButtonPresentationProps;
}

export const productShareLinkStyles: ProductShareLinkStyles = {
    modal: {
        size: 600,
        cssOverrides: {
            modalTitle: css` padding: 10px 30px; `,
            modalContent: css` padding: 20px 30px; `,
        },
    },
    container: { gap: 10 },
    recipientNameGridItem: {
        width: 6,
        css: css` padding-right: 10px; `,
    },
    recipientEmailGridItem: {
        width: 6,
        css: css` padding-left: 10px; `,
    },
    yourNameGridItem: {
        width: 6,
        css: css` padding-right: 10px; `,
    },
    yourEmailGridItem: {
        width: 6,
        css: css` padding-left: 10px; `,
    },
    yourMessageGridItem: {
        width: 12,
    },
    yourMessageTextArea: {
        cssOverrides: {
            inputSelect: css` resize: none; `,
        },
    },
    buttonsWrapper: {
        css: css`
            margin-top: 30px;
            text-align: right;
        `,
    },
    cancelButton: {
        variant: "secondary",
    },
    shareButton: {
        css: css` margin-left: 10px; `,
    },
};

const ProductShareLink: React.FC<Props> = ({
    product,
    text,
    session,
    shareProduct,
    extendedStyles,
}) => {
    const toasterContext = React.useContext(ToasterContext);
    const [styles] = React.useState(() => mergeToNew(productShareLinkStyles, extendedStyles));
    const isAuthenticated = (session.isAuthenticated || session.rememberMe) && !session.isGuest;
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [recipientName, setRecipientName] = React.useState("");
    const [recipientNameError, setRecipientNameError] = React.useState("");
    const [recipientEmail, setRecipientEmail] = React.useState("");
    const [recipientEmailError, setRecipientEmailError] = React.useState("");
    const initialYourName = isAuthenticated ? `${session!.firstName} ${session!.lastName}`.trim() || session!.userName || "" : "";
    const [yourName, setYourName] = React.useState(initialYourName);
    const [yourNameError, setYourNameError] = React.useState("");
    const initialYourEmail = isAuthenticated ? session.email || "" : "";
    const [yourEmail, setYourEmail] = React.useState(initialYourEmail);
    const [yourEmailError, setYourEmailError] = React.useState("");
    const [yourMessage, setYourMessage] = React.useState("");
    const [yourMessageError, setYourMessageError] = React.useState("");

    const modalCloseHandler = () => {
        setModalIsOpen(false);
    };

    const shareLinkClickHandler = () => {
        resetFields();
        setModalIsOpen(true);
    };

    const requiredFieldMessage = translate("This is a required field");
    const emailFieldMessage = translate("Enter a valid email address");
    const checkForErrors = () => {
        const regexp = new RegExp("\\w+([-+.\']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");

        const localRecipientNameError = !recipientName ? requiredFieldMessage : "";
        setRecipientNameError(localRecipientNameError);
        const localRecipientEmailError = !recipientEmail ? requiredFieldMessage : (regexp.test(recipientEmail) ? "" : emailFieldMessage);
        setRecipientEmailError(localRecipientEmailError);
        const localYourNameError = !yourName ? requiredFieldMessage : "";
        setYourNameError(localYourNameError);
        const localYourEmailError = !yourEmail ? requiredFieldMessage : (regexp.test(yourEmail) ? "" : emailFieldMessage);
        setYourEmailError(localYourEmailError);
        const localYourMessageError = !yourMessage ? requiredFieldMessage : "";
        setYourMessageError(localYourMessageError);

        return !!(localRecipientNameError || localRecipientEmailError || localYourNameError || localYourEmailError || localYourMessageError);
    };

    const resetFields = () => {
        setRecipientName("");
        setRecipientNameError("");
        setRecipientEmail("");
        setRecipientEmailError("");
        setYourName(initialYourName);
        setYourNameError("");
        setYourEmail(initialYourEmail);
        setYourEmailError("");
        setYourMessage("");
        setYourMessageError("");
    };

    const recipientNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecipientName(event.target.value);
        setRecipientNameError(!event.target.value ? requiredFieldMessage : "");
    };
    const recipientEmailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRecipientEmail(event.target.value);
        setRecipientEmailError(!event.target.value ? requiredFieldMessage : "");
    };
    const yourNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setYourName(event.target.value);
        setYourNameError(!event.target.value ? requiredFieldMessage : "");
    };
    const yourEmailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setYourEmail(event.target.value);
        setYourEmailError(!event.target.value ? requiredFieldMessage : "");
    };
    const yourMessageChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setYourMessage(event.target.value);
        setYourMessageError(!event.target.value ? requiredFieldMessage : "");
    };

    const shareButtonClickHandler = () => {
        if (checkForErrors()) {
            return;
        }

        shareProduct({
            product,
            friendsName: recipientName,
            friendsEmailAddress: recipientEmail,
            yourName,
            yourEmailAddress: yourEmail,
            yourMessage,
            onSuccess: () => {
                setModalIsOpen(false);
                toasterContext.addToast({ body: siteMessage("TellAFriend_Success"), messageType: "success" });
            },
        });
    };

    return <>
        <Link {...styles.link} onClick={shareLinkClickHandler} data-test-selector="productShareLink">{text || translate("Share")}</Link>
        <Modal
            {...styles.modal}
            headline={translate("Share Product")}
            isOpen={modalIsOpen}
            handleClose={modalCloseHandler}
        >
            <GridContainer {...styles.container} data-test-selector="productShareModal">
                <GridItem {...styles.recipientNameGridItem}>
                    <TextField
                        label={translate("Recipient Name*")}
                        value={recipientName}
                        error={recipientNameError}
                        onChange={recipientNameChangeHandler}
                        data-test-selector="productShareRecipientName"
                        {...styles.recipientNameTextField} />
                </GridItem>
                <GridItem {...styles.recipientEmailGridItem}>
                    <TextField
                        label={translate("Recipient Email*")}
                        value={recipientEmail}
                        error={recipientEmailError}
                        onChange={recipientEmailChangeHandler}
                        data-test-selector="productShareRecipientEmail"
                        {...styles.recipientEmailTextField} />
                </GridItem>
                <GridItem {...styles.yourNameGridItem}>
                    <TextField
                        label={translate("Your Name*")}
                        value={yourName}
                        error={yourNameError}
                        onChange={yourNameChangeHandler}
                        data-test-selector="productShareYourName"
                        {...styles.yourNameTextField} />
                </GridItem>
                <GridItem {...styles.yourEmailGridItem}>
                    <TextField
                        label={translate("Your Email*")}
                        value={yourEmail}
                        error={yourEmailError}
                        onChange={yourEmailChangeHandler}
                        data-test-selector="productShareYourEmail"
                        {...styles.yourEmailTextField} />
                </GridItem>
                <GridItem {...styles.yourMessageGridItem}>
                    <TextArea
                        label={translate("Your Message*")}
                        value={yourMessage}
                        error={yourMessageError}
                        onChange={yourMessageChangeHandler}
                        data-test-selector="productShareYourMessage"
                        {...styles.yourMessageTextArea} />
                </GridItem>
            </GridContainer>
            <StyledWrapper {...styles.buttonsWrapper}>
                <Button {...styles.cancelButton} onClick={modalCloseHandler} data-test-selector="productShareCancel">{translate("Cancel")}</Button>
                <Button {...styles.shareButton} onClick={shareButtonClickHandler} data-test-selector="productShareSubmit">{translate("Share")}</Button>
            </StyledWrapper>
        </Modal>
    </>;
};

export default connect(mapStateToProps, mapDispatchToProps)(withProduct(ProductShareLink));
