import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import AddressInfoDisplay from "@insite/content-library/Components/AddressInfoDisplay";
import {
    BillToModel,
} from "@insite/client-framework/Types/ApiModels";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import translate from "@insite/client-framework/Translate";
import updateAccountSettings from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/UpdateAccountSettings";
import BillToSelector, { BillToSelectorStyles } from "@insite/content-library/Components/BillToSelector";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { css } from "styled-components";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";

interface OwnProps {
    currentBillTo?: BillToModel;
    extendedStyles?: DefaultBillingAddressStyles;
}

const mapDispatchToProps = {
    updateAccountSettings,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface DefaultBillingAddressStyles {
    gridContainer?: GridContainerProps;
    headingGridItem?: GridItemProps;
    headingText?: TypographyProps;
    editLinkGridItem?: GridItemProps;
    editLink?: LinkPresentationProps;
    customerSelectorModal?: ModalPresentationProps;
    billToSelector?: BillToSelectorStyles;
    customerSelectorModalButtonsWrapper?: InjectableCss;
    customerSelectorModalCancelButton?: ButtonPresentationProps;
    addressInfoDisplayGridItem?: GridItemProps;
}

export const defaultBillingAddressStyles: DefaultBillingAddressStyles = {
    gridContainer: { gap: 5 },
    headingGridItem: { width: 12 },
    headingText: {
        variant: "h5",
        css: css` margin-bottom: 0; `,
    },
    editLink: {
        css: css`
            margin-left: 10px;
            margin-top: 5px;
        `,
    },
    customerSelectorModal: { sizeVariant: "medium" },
    customerSelectorModalButtonsWrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
            margin-top: 1rem;
        `,
    },
    customerSelectorModalCancelButton: { variant: "secondary" },
    addressInfoDisplayGridItem: { width: 12 },
};

const DefaultBillingAddress: React.FunctionComponent<Props> = ({
                                                                   currentBillTo,
                                                                   updateAccountSettings,
                                                                   extendedStyles,
                                                               }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const editClickHandler = () => {
        setIsModalOpen(true);
    };

    const selectBillToHandler = (customer: BillToModel) => {
        if (currentBillTo?.id !== customer.id) {
            updateAccountSettings({
                billToId: customer.id,
                shipToId: "",
            });
        }

        modalCloseHandler();
    };

    const modalCloseHandler = () => setIsModalOpen(false);

    const [styles] = React.useState(() => mergeToNew(defaultBillingAddressStyles, extendedStyles));

    return (
        <GridContainer {...styles.gridContainer}>
            <GridItem {...styles.headingGridItem}>
                <Typography {...styles.headingText}>{translate("Default Billing Address")}</Typography>
                <Link {...styles.editLink} onClick={editClickHandler} data-test-selector="accountSettings_changeBilling">{translate("Change")}</Link>
                <Modal
                    headline={translate("Choose Billing Information")}
                    {...styles.customerSelectorModal}
                    isOpen={isModalOpen}
                    handleClose={modalCloseHandler}
                >
                    <BillToSelector
                        currentBillTo={currentBillTo}
                        onSelect={selectBillToHandler}
                        extendedStyles={styles.billToSelector}
                    />
                    <StyledWrapper {...styles.customerSelectorModalButtonsWrapper}>
                        <Button
                            {...styles.customerSelectorModalCancelButton}
                            onClick={modalCloseHandler}
                        >
                            {translate("Cancel")}
                        </Button>
                    </StyledWrapper>
                </Modal>
            </GridItem>
            {currentBillTo
            && <GridItem {...styles.addressInfoDisplayGridItem} data-test-selector={`accountSettings_billing_${currentBillTo?.id}`}>
                <AddressInfoDisplay
                    {...currentBillTo}
                    state={currentBillTo.state?.abbreviation}
                    country={currentBillTo.country?.abbreviation}
                />
            </GridItem>
            }
        </GridContainer>
    );
};

export default connect(null, mapDispatchToProps)(DefaultBillingAddress);
