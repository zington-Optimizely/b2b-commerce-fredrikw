import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import * as React from "react";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { css } from "styled-components";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import setAddToListModalIsOpen, { wishListsParameter } from "@insite/client-framework/Store/Components/AddToListModal/Handlers/SetAddToListModalIsOpen";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import { getCookie, setCookie } from "@insite/client-framework/Common/Cookies";
import { getWishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";

interface OwnProps {
    extendedStyles?: AddToListModalStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    session: state.context.session,
    modalIsOpen: state.components.addToListModal.isOpen,
    products: state.components.addToListModal.products,
    wishLists: getWishListsDataView(state, wishListsParameter).value,
});

const mapDispatchToProps = {
    setAddToListModalIsOpen,
    addToWishList,
};

export interface AddToListModalStyles {
    modal?: ModalPresentationProps;
    signInMessageText?: TypographyProps;
    descriptionText?: TypographyProps;
    listsSelect?: SelectPresentationProps;
    newListInput?: TextFieldProps;
    buttonsWrapper?: InjectableCss;
    cancelButton?: ButtonPresentationProps;
    addButton?: ButtonPresentationProps;
}

export const addToListModalStyles: AddToListModalStyles = {
    modal: {
        size: 350,
        cssOverrides: {
            modalTitle: css` padding: 10px 20px; `,
            modalContent: css` padding: 20px; `,
        },
    },
    descriptionText: {
        as: "p",
    },
    listsSelect: {
        cssOverrides: {
            formField: css` margin-top: 15px; `,
        },
    },
    newListInput: {
        cssOverrides: {
            formField: css` margin-top: 15px; `,
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
    addButton: {
        css: css` margin-left: 10px; `,
    },
};

const LastUpdatedListIdCookieName = "LastUpdatedListId";

const AddToListModal: React.FC<Props> = ({
    products,
    session,
    modalIsOpen,
    wishLists,
    setAddToListModalIsOpen,
    addToWishList,
    extendedStyles,
}) => {
    const [styles] = React.useState(() => mergeToNew(addToListModalStyles, extendedStyles));

    const toasterContext = React.useContext(ToasterContext);

    const isAuthenticated = session && (session.isAuthenticated || session.rememberMe) && !session.isGuest;
    const [selectedWishList, setSelectedWishList] = React.useState<WishListModel>();
    const [newListName, setNewListName] = React.useState("");
    const [newListNameError, setNewListNameError] = React.useState<React.ReactNode>("");

    React.useEffect(() => {
        if (!modalIsOpen) {
            return;
        }

        const lastUpdatedListId = getCookie(LastUpdatedListIdCookieName);
        const lastUpdatedList = wishLists?.find(wishList => wishList.id === lastUpdatedListId);
        setSelectedWishList(lastUpdatedList);
    }, [modalIsOpen]);

    if (!products) {
        return null;
    }

    const modalCloseHandler = () => {
        setNewListName("");
        setNewListNameError("");
        setAddToListModalIsOpen({ modalIsOpen: false });
    };

    const listChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedList = wishLists!.find(wishList => wishList.id.toString() === event.target.value);
        setSelectedWishList(selectedList);
    };

    const newListInputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewListName(event.target.value);
        if (event.target.value) {
            setNewListNameError("");
        }
    };

    const addToListButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setNewListNameError("");

        if (!selectedWishList && !newListName) {
            setNewListNameError(siteMessage("Lists_Enter_New_Wishlist_Name"));
            return;
        }

        addToWishList({
            products,
            selectedWishList,
            newListName,
            onSuccess: (wishList: WishListModel) => {
                setCookie(LastUpdatedListIdCookieName, wishList.id);
                setAddToListModalIsOpen({ modalIsOpen: false });
                setSelectedWishList(wishList);
                setNewListName("");
                toasterContext.addToast({ body: siteMessage("Lists_ProductAdded"), messageType: "success" });
            },
            onError: (errorMessage) => {
                setNewListNameError(errorMessage);
            },
        });
    };

    return <Modal
        {...styles.modal}
        headline={isAuthenticated ? translate("Add to List") : translate("Please Sign In")}
        isOpen={modalIsOpen}
        handleClose={modalCloseHandler}
    >
        <div data-test-selector="productAddToListModal">
            {!isAuthenticated
                && <Typography
                    data-test-selector="productAddToListModal_requireSignIn"
                    {...styles.signInMessageText}
                >
                    {siteMessage("Lists_Must_Sign_In")}
                </Typography>
            }
            {isAuthenticated
                && <form>
                    <Typography {...styles.descriptionText}>{translate("Copy items to a new or existing list.")}</Typography>
                    <Select
                        label={translate("Select List")}
                        value={selectedWishList?.id.toString() || "new"}
                        onChange={listChangeHandler}
                        {...styles.listsSelect}
                        data-test-selector="productAddToListModal_listSelect"
                    >
                        <option value="new">{translate("Create New List")}</option>
                        {wishLists?.map(wishList =>
                            <option key={wishList.id.toString()} value={wishList.id.toString()}>{wishList.name}</option>)
                        }
                    </Select>
                    {!selectedWishList
                        && <TextField
                            label={translate("New List Name")}
                            value={newListName}
                            error={newListNameError}
                            onChange={newListInputChangeHandler}
                            {...styles.newListInput}
                            data-test-selector="productAddToListModal_newName" />
                    }
                    <StyledWrapper {...styles.buttonsWrapper}>
                        <Button {...styles.cancelButton} onClick={modalCloseHandler}>{translate("Cancel")}</Button>
                        <Button
                            {...styles.addButton}
                            onClick={e => addToListButtonClickHandler(e)}
                            data-test-selector="productAddToListModal_addButton">
                            {translate("Add to List")}
                        </Button>
                    </StyledWrapper>
                </form>
            }
        </div>
    </Modal>;
};

export default connect(mapStateToProps, mapDispatchToProps)(AddToListModal);
