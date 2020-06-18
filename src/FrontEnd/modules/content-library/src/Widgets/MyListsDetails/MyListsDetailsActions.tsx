import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import addLinesToCart from "@insite/client-framework/Store/Pages/Cart/Handlers/AddLinesToCart";
import addWishListToCart from "@insite/client-framework/Store/Pages/Cart/Handlers/AddWishListToCart";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import deleteWishList from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/DeleteWishList";
import deleteWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/DeleteWishListLines";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import updateLoadWishListLinesParameter from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateLoadWishListLinesParameter";
import loadWishLists from "@insite/client-framework/Store/Pages/MyLists/Handlers/LoadWishLists";
import updateLoadParameter from "@insite/client-framework/Store/Pages/MyLists/Handlers/UpdateLoadParameter";
import translate from "@insite/client-framework/Translate";
import { WishListLineModel, CartLineModel, CartLineCollectionModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import PrintAllPagesModal from "@insite/content-library/Components/PrintAllPagesModal";
import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import { MyListsDetailsPageContext } from "@insite/content-library/Pages/MyListsDetailsPage";
import MyListsEditListForm from "@insite/content-library/Widgets/MyLists/MyListsEditListForm";
import MyListsDetailsCopyListForm from "@insite/content-library/Widgets/MyListsDetails/MyListsDetailsCopyListForm";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import ScheduleReminderModal, { ScheduleReminderModalStyles } from "@insite/content-library/Components/ScheduleReminderModal";
import setShareListModalIsOpen from "@insite/client-framework/Store/Components/ShareListModal/Handlers/SetShareListModalIsOpen";
import { ShareOptions } from "@insite/client-framework/Services/WishListService";

interface State {
    updateListModalIsOpen: boolean;
    deleteListModalIsOpen: boolean;
    copyListModalIsOpen: boolean;
    printAllModalIsOpen: boolean;
    scheduleReminderModalIsOpen: boolean;
}

const mapStateToProps = (state: ApplicationState) => ({
    wishList: getWishListState(state, state.pages.myListDetails.wishListId).value,
    wishListLinesDataView: getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter),
    wishListSettings: getSettingsCollection(state).wishListSettings,
    selectedWishListLineIds: state.pages.myListDetails.selectedWishListLineIds,
    myListsPageLink: getPageLinkByPageType(state, "MyListsPage"),
    allowEditingOfWishLists: getSettingsCollection(state).wishListSettings.allowEditingOfWishLists,
});

const mapDispatchToProps = {
    addWishListToCart,
    addLinesToCart,
    deleteWishList,
    deleteWishListLines,
    loadWishLists,
    loadWishListLines: makeHandlerChainAwaitable(loadWishListLines),
    updateLoadParameter,
    updateLoadWishListLinesParameter,
    setShareListModalIsOpen,
};

type Props = WidgetProps & HasHistory & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export interface MyListsDetailsActionStyles {
    wrapper?: InjectableCss;
    buttonWrapper?: InjectableCss;
    wideHidden?: HiddenProps;
    nameText?: TypographyProps;
    overflowMenu?: OverflowMenuPresentationProps;
    narrowHidden?: HiddenProps;
    printButton?: ButtonPresentationProps;
    scheduleButton?: ButtonPresentationProps;
    editButton?: ButtonPresentationProps;
    shareButton?: ButtonPresentationProps;
    addItemButton?: ButtonPresentationProps;
    removeSelectedButton?: ButtonPresentationProps;
    addListButton?: ButtonPresentationProps;
    editListModal?: ModalPresentationProps;
    deleteListModal?: TwoButtonModalStyles;
    printListModal?: TwoButtonModalStyles;
    copyListModal?: ModalPresentationProps;
    scheduleReminderModal?: ScheduleReminderModalStyles;
}

const styles: MyListsDetailsActionStyles = {
    wrapper: {
        css: css`
            display: flex;
            justify-content: space-between;
        `,
    },
    buttonWrapper: {
        css: css`
            display: flex;
            flex-wrap: nowrap;
        `,
    },
    wideHidden: {
        below: "lg",
        css: css`
            display: flex;
            flex-wrap: nowrap;
        `,
    },
    nameText: {
        variant: "h3",
        as: "h1",
        ellipsis: true,
    },
    narrowHidden: {
        above: "md",
    },
    printButton: {
        css: css`
            padding: 0 15px;
            margin-right: 10px;
        `,
        variant: "secondary",
    },
    scheduleButton: {
        css: css`
            padding: 0 15px;
            margin-right: 10px;
        `,
        variant: "secondary",
    },
    editButton: {
        css: css`
            padding: 0 15px;
            margin-right: 10px;
        `,
        variant: "secondary",
    },
    shareButton: {
        css: css`
            padding: 0 15px;
            margin-right: 10px;
        `,
        variant: "secondary",
    },
    addItemButton: {
        typographyProps: {
            weight: "bold",
            css: css` white-space: nowrap; `,
        },
        css: css`
            padding: 0 15px;
            margin-right: 10px;
        `,
        variant: "secondary",
    },
    removeSelectedButton: {
        typographyProps: {
            weight: "bold",
            css: css` white-space: nowrap; `,
        },
        css: css`
            padding: 0 15px;
            margin-right: 10px;
        `,
        variant: "tertiary",
    },
    addListButton: {
        typographyProps: {
            weight: "bold",
            css: css` white-space: nowrap; `,
        },
        css: css` padding: 0 15px; `,
    },
    editListModal: {
        sizeVariant: "small",
    },
    copyListModal: {
        sizeVariant: "small",
    },
};

export const actionStyles = styles;

class MyListsDetailsActions extends React.Component<Props, State> {

    static contextType = ToasterContext;
    context!: React.ContextType<typeof ToasterContext>;

    constructor(props: Props) {
        super(props);
        this.state = {
            updateListModalIsOpen: false,
            printAllModalIsOpen: false,
            deleteListModalIsOpen: false,
            copyListModalIsOpen: false,
            scheduleReminderModalIsOpen: false,
        };
    }

    displayToast(message: string) {
        this.context.addToast({ body: message, messageType: "success" });
    }

    linesSelected() {
        return this.props.selectedWishListLineIds.length > 0;
    }

    enableAddToCart() {
        const lines = this.props.wishListLinesDataView.value;
        return this.props.wishList?.canAddToCart && lines && this.allQuantitiesAreValid(lines);
    }
    allQuantitiesAreValid(wishListLines: WishListLineModel[]): boolean {
        return wishListLines
            .filter(o => this.props.selectedWishListLineIds.length === 0 || this.props.selectedWishListLineIds.indexOf(o.id) > -1)
            .every(o => o.qtyOrdered && parseFloat(o.qtyOrdered.toString()) > 0);
    }

    editClickHandler = () => {
        this.setState({ updateListModalIsOpen: true });
    };

    shareClickHandler = () => {
        this.props.setShareListModalIsOpen({ modalIsOpen: true, wishListId: this.props.wishList?.id });
    };

    printOrOpenPrintAllModal = () => {
        const { wishListLinesDataView } = this.props;
        if (!wishListLinesDataView.value || !wishListLinesDataView.pagination) return null;

        const { pagination: { totalItemCount, pageSize } } = wishListLinesDataView;
        if (pageSize >= totalItemCount) {
            openPrintDialog();
        } else {
            this.setState({ printAllModalIsOpen: true });
        }
    };

    closePrintModal = () => {
        this.setState({ printAllModalIsOpen: false });
    };

    editCloseHandler = () => {
        this.setState({ updateListModalIsOpen: false });
    };

    addToCartClickHandler = (e: any) => {
        e.preventDefault();
        if (!this.props.wishList || !this.props.wishListLinesDataView.value) {
            return;
        }

        if (this.linesSelected()) {
            const cartLines = this.props.wishListLinesDataView.value
                .filter(o => this.props.selectedWishListLineIds.indexOf(o.id) > -1)
                .map(o => o as any as CartLineModel);
            this.props.addLinesToCart({
                apiParameter: { cartId: API_URL_CURRENT_FRAGMENT, cartLineCollection: { cartLines } as CartLineCollectionModel },
                onSuccess: this.onAddToCartSuccess,
            });
        } else {
            this.props.addWishListToCart({
                apiParameter: { wishListId: this.props.wishList.id },
                onSuccess: this.onAddToCartSuccess,
            });
        }
    };

    onAddToCartSuccess = () => {
        this.displayToast(this.linesSelected() ? translate("Added to Cart") : translate("List Added to Cart"));
    };

    removeSelectedClickHandler = (e: any) => {
        e.preventDefault();
        if (!this.props.wishList || !this.props.wishListLinesDataView.value) {
            return;
        }

        const wishListLineIds = this.props.wishListLinesDataView.value
            .filter(o => this.props.selectedWishListLineIds.indexOf(o.id) > -1)
            .map(o => o.id);
        this.props.deleteWishListLines({
            wishListId: this.props.wishList.id,
            wishListLineIds,
            reloadWishListLines: true,
            onSuccess: this.onRemoveSelectedSuccess,
        });
    };

    onRemoveSelectedSuccess = () => {
        this.displayToast(translate("Items Deleted"));
    };

    deleteClickHandler = () => {
        this.setState({ deleteListModalIsOpen: true });
    };

    deleteCancelHandler = () => {
        this.setState({ deleteListModalIsOpen: false });
    };

    deleteSubmitHandler = () => {
        if (!this.props.wishList) {
            return;
        }

        this.setState({ deleteListModalIsOpen: false });
        this.props.deleteWishList({
            wishListId: this.props.wishList.id,
            onSuccess: this.onDeleteSuccess,
        });
    };

    onDeleteSuccess = () => {
        this.displayToast(translate("List Deleted"));
        this.props.myListsPageLink && this.props.history.push(this.props.myListsPageLink.url);
    };

    copyClickHandler = () => {
        this.props.updateLoadParameter({ pageSize: 999 });
        this.props.loadWishLists();
        this.setState({ copyListModalIsOpen: true });
    };

    copyCancelHandler = () => {
        this.setState({ copyListModalIsOpen: false });
    };

    copySubmitHandler = () => {
        this.setState({ copyListModalIsOpen: false });
    };

    scheduleReminderClickHandler = () => {
        this.setState({ scheduleReminderModalIsOpen: true });
    };

    closeScheduleReminderModalHandler = () => {
        this.setState({ scheduleReminderModalIsOpen: false });
    };

    render() {
        const { wishList, wishListSettings, wishListLinesDataView, allowEditingOfWishLists } = this.props;
        if (!wishList) {
            return null;
        }

        const showEdit = (wishList.allowEdit || !wishList.isSharedList);
        const showShare = !wishList.isSharedList && wishListSettings.allowMultipleWishLists && wishListSettings.allowListSharing;
        const showRemoveSelected = (wishList.allowEdit || !wishList.isSharedList) && this.linesSelected();
        const showSchedule = wishListSettings.enableWishListReminders;
        const showAddToCart = (wishListLinesDataView.value?.length || 0) > 0;
        const showCopy = wishListSettings.allowMultipleWishLists && showAddToCart;
        const addListToCartButtonText = this.linesSelected() ? translate("Add Selected to Cart") : translate("Add List To Cart");
        const scheduleButtonText = wishList.schedule ? translate("Edit Reminder") : translate("Schedule Reminder");
        const showDelete = allowEditingOfWishLists && !wishList.isSharedList;

        return (
            <StyledWrapper {...styles.wrapper}>
                <Typography {...styles.nameText} data-test-selector="listName">{wishList.name}</Typography>
                <StyledWrapper {...styles.buttonWrapper} data-test-selector="menuWrapper">
                    <Hidden {...styles.narrowHidden}>
                        <OverflowMenu position="end" {...styles.overflowMenu} >
                            {showAddToCart ? <Clickable onClick={this.addToCartClickHandler}>{addListToCartButtonText}</Clickable> : null}
                            {showRemoveSelected ? <Clickable onClick={this.removeSelectedClickHandler}>{translate("Remove Selected")}</Clickable> : null}
                            {showShare ? <Clickable onClick={this.shareClickHandler}>{translate("Share")}</Clickable> : null}
                            <Clickable onClick={this.printOrOpenPrintAllModal}>{translate("Print")}</Clickable>
                            {showEdit ? <Clickable onClick={this.editClickHandler}>{translate("Edit")}</Clickable> : null}
                            {showSchedule ? <Clickable onClick={this.scheduleReminderClickHandler}>{scheduleButtonText}</Clickable> : null}
                            {showCopy ? <Clickable onClick={this.copyClickHandler}>{translate("Copy")}</Clickable> : null}
                            {showDelete ? <Clickable onClick={this.deleteClickHandler}>{translate("Delete")}</Clickable> : null}
                        </OverflowMenu>
                    </Hidden>
                    <Hidden {...styles.wideHidden} data-test-selector="wideHidden">
                        <OverflowMenu {...styles.overflowMenu}>
                            {showCopy ? <Clickable onClick={this.copyClickHandler} data-test-selector="copyList">{translate("Copy")}</Clickable> : null}
                            {showDelete ? <Clickable onClick={this.deleteClickHandler} data-test-selector="deleteList">{translate("Delete")}</Clickable> : null}
                        </OverflowMenu>
                        <Button {...styles.printButton} onClick={this.printOrOpenPrintAllModal}>{translate("Print")}</Button>
                        {showSchedule ? <Button {...styles.scheduleButton} onClick={this.scheduleReminderClickHandler}>{scheduleButtonText}</Button> : null}
                        {showEdit ? <Button {...styles.editButton} onClick={this.editClickHandler} data-test-selector="editList">{translate("Edit")}</Button> : null}
                        {showShare ? <Button {...styles.shareButton} onClick={this.shareClickHandler} data-test-selector="shareList">{translate("Share")}</Button> : null}
                        {showRemoveSelected ? <Button {...styles.removeSelectedButton} onClick={this.removeSelectedClickHandler} data-test-selector="removeSelected">
                            {translate("Remove Selected")}</Button> : null}
                        <Button disabled={!this.enableAddToCart() || !showAddToCart} {...styles.addListButton}
                            onClick={this.addToCartClickHandler} data-test-selector="addListToCart">{addListToCartButtonText}</Button>
                    </Hidden>
                </StyledWrapper>
                <Modal
                    headline={translate("Edit List Detail")}
                    {...styles.editListModal}
                    isOpen={this.state.updateListModalIsOpen}
                    handleClose={this.editCloseHandler}>
                    <MyListsEditListForm
                        wishList={wishList}
                        onCancel={this.editCloseHandler}
                        onSubmit={this.editCloseHandler}>
                    </MyListsEditListForm>
                </Modal>
                <TwoButtonModal
                    headlineText={translate("Delete List")}
                    {...styles.deleteListModal}
                    modalIsOpen={this.state.deleteListModalIsOpen}
                    messageText={`${translate("Are you sure you want to delete")} ${wishList.name}?`}
                    cancelButtonText={translate("Cancel")}
                    submitButtonText={translate("Delete")}
                    onCancel={this.deleteCancelHandler}
                    onSubmit={this.deleteSubmitHandler}
                    submitTestSelector="submitDeleteList"
                >
                </TwoButtonModal>
                {wishListLinesDataView.value
                    && <PrintAllPagesModal
                        isOpen={this.state.printAllModalIsOpen}
                        handleClose={this.closePrintModal}
                        updateParameterFunction={(pageSize) => this.props.updateLoadWishListLinesParameter({ wishListId: wishList.id, pageSize })}
                        awaitableLoader={this.props.loadWishListLines}
                        initialPageSize={(wishListLinesDataView.value ? wishListLinesDataView.pagination?.pageSize || 8 : 8)}
                        reloading={false}
                        lineCollection={{ pagination: (wishListLinesDataView.value ? wishListLinesDataView?.pagination || null : null) }}
                        styles={styles.printListModal}
                    />
                }
                <Modal
                    headline={translate("Copy List")}
                    isOpen={this.state.copyListModalIsOpen}
                    handleClose={this.copyCancelHandler}
                    {...styles.copyListModal}>
                    <MyListsDetailsCopyListForm
                        onCancel={this.copyCancelHandler}
                        onSubmit={this.copySubmitHandler}>
                    </MyListsDetailsCopyListForm>
                </Modal>
                <ScheduleReminderModal
                    wishList={wishList}
                    isOpen={this.state.scheduleReminderModalIsOpen}
                    handleClose={this.closeScheduleReminderModalHandler}
                    extendedStyles={styles.scheduleReminderModal}
                />
            </StyledWrapper>
        );
    }
}

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(MyListsDetailsActions)),
    definition: {
        group: "My Lists Details",
        displayName: "Actions",
        allowedContexts: [MyListsDetailsPageContext],
        isSystem: true,
    },
};

export default widgetModule;
