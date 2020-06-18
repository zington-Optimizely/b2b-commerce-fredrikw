import React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { MyListsDetailsPageContext } from "@insite/content-library/Pages/MyListsDetailsPage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import TwoButtonModal from "@insite/content-library/Components/TwoButtonModal";
import { WishListLineModel } from "@insite/client-framework/Types/ApiModels";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import MyListsDetailsProductListLine from "@insite/content-library/Widgets/MyListsDetails/MyListsDetailsProductListLine";
import updateWishListLine from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateWishListLine";
import deleteWishListLine from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/DeleteWishListLine";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import updateLoadWishListLinesParameter from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateLoadWishListLinesParameter";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";

const mapStateToProps = (state: ApplicationState) => ({
    wishListDataView: getWishListState(state, state.pages.myListDetails.wishListId),
    wishListLinesDataView: getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter),
    loadWishListLinesParameter: state.pages.myListDetails.loadWishListLinesParameter,
});

const mapDispatchToProps = {
    updateLoadWishListLinesParameter,
    loadWishListLines,
    updateWishListLine,
    deleteWishListLine,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface MyListsDetailsProductListStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    messageText?: TypographyPresentationProps;
    container?: GridContainerProps;
    lineGridItem?: GridItemProps;
    paginationGridItem?: GridItemProps;
    pagination?: PaginationPresentationProps;
    editNotesModal?: ModalPresentationProps;
    notesTextArea?: TextAreaProps;
    editNotesModalButtonsWrapper?: InjectableCss;
    editNotesModalDeleteButton?: ButtonPresentationProps;
    editNotesModalCancelButton?: ButtonPresentationProps;
    editNotesModalSubmitButton?: ButtonPresentationProps;
}

const styles: MyListsDetailsProductListStyles = {
    centeringWrapper: {
        css: css` 
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: { css: css` margin: auto; ` },
    messageText: {
        variant: "h4",
        css: css`
            display: block;
            margin: auto;
        `,
    },
    container: {
        gap: 0,
        css: css`
            /* Note: below line is to prevent a weird behavior where chrome wants to print anything that will fit
            * comprehensively on a single page on that page, which means the product list appears on page 2
            when rendering a common 8-item list with no notes. That's not ideal, so we're arbitrarily making
            the component large enough that it won't fit on a single page. */
            @media print { padding-bottom: 120px; }
            border-top: 1px lightgray solid;
        `,
    },
    lineGridItem: {
        width: 12,
        css: css`
            border-bottom: 1px lightgray solid;
            padding: 20px 0;
        `,
    },
    paginationGridItem: {
        width: 12,
        css: css` justify-content: flex-end; `,
    },
    pagination: { cssOverrides: { pagination: css` @media print { display: none; } ` } },
    editNotesModalButtonsWrapper: {
        css: css`
            @media print { display: none; }
            margin-top: 30px;
            text-align: right;
        `,
    },
    editNotesModalDeleteButton: { variant: "secondary" },
    editNotesModalCancelButton: {
        variant: "secondary",
        css: css` margin-left: 10px; `,
    },
    editNotesModalSubmitButton: { css: css` margin-left: 10px; ` },
};

export const productListStyles = styles;

const MyListsDetailsProductList: React.FC<Props> = ({
    wishListDataView,
    wishListLinesDataView,
    loadWishListLinesParameter,
    updateLoadWishListLinesParameter,
    loadWishListLines,
    updateWishListLine,
    deleteWishListLine,
}) => {
    if (!wishListDataView.value || !wishListLinesDataView.value || wishListLinesDataView.isLoading || !wishListLinesDataView.pagination) {
        return <StyledWrapper {...styles.centeringWrapper}>
            <LoadingSpinner {...styles.spinner} />
        </StyledWrapper>;
    }

    const wishList = wishListDataView.value;
    const wishListLines = wishListLinesDataView.value;
    const { pagination, products } = wishListLinesDataView;

    const [wishListLineToAction, setWishListLineToAction] = React.useState<WishListLineModel | null>(null);
    const [deleteLineModalIsOpen, setDeleteLineModalIsOpen] = React.useState(false);
    const deleteCancelHandler = () => {
        setDeleteLineModalIsOpen(false);
    };

    const deleteSubmitHandler = () => {
        if (!wishListLineToAction) {
            return;
        }

        deleteWishListLine({
            wishListId: wishList.id,
            wishListLineId: wishListLineToAction.id,
            reloadWishListLines: true,
            onSuccess: () => {
                setDeleteLineModalIsOpen(false);
            },
        });
    };

    const deleteClickHandler = (wishListLine: WishListLineModel) => {
        setWishListLineToAction(wishListLine);
        setDeleteLineModalIsOpen(true);
    };

    const changePageHandler = (newPageIndex: number) => {
        updateLoadWishListLinesParameter({ page: newPageIndex });
        loadWishListLines();
    };

    const changeResultsPerPageHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        updateLoadWishListLinesParameter({ pageSize: newPageSize });
        loadWishListLines();
    };

    const [editNotesModalIsOpen, setEditNotesModalIsOpen] = React.useState(false);
    const editNotesModalCancelHandler = () => {
        setEditNotesModalIsOpen(false);
    };

    const editNotesClickHandler = (wishListLine: WishListLineModel) => {
        setWishListLineToAction(wishListLine);
        setEditNotesModalIsOpen(true);
    };

    const editNotesModalSubmitHandler = (notes: string) => {
        const wishListLineToUpdate = { ...wishListLineToAction, notes } as WishListLineModel;
        updateWishListLine({
            wishListId: wishList.id,
            wishListLineId: wishListLineToUpdate.id,
            wishListLine: wishListLineToUpdate,
            reloadWishListLines: false,
            onSuccess: () => { setEditNotesModalIsOpen(false); },
        });
    };

    if (!wishListLines || wishListLines.length === 0 || products.length === 0) {
        return <StyledWrapper {...styles.centeringWrapper}>
            <Typography {...styles.messageText} data-test-selector="noItemsMessage">
                {loadWishListLinesParameter.query ? siteMessage("Lists_NoResultsMessage") : siteMessage("Lists_NoItemsInList")}
            </Typography>
        </StyledWrapper>;
    }

    return <>
        <GridContainer {...styles.container} data-test-selector="linesContainer">
            {wishListLines.map((wishListLine, index) =>
                <GridItem
                    {...styles.lineGridItem}
                    key={wishListLine.id}
                    data-test-selector="lineContainer"
                >
                    <MyListsDetailsProductListLine
                        wishList={wishList}
                        wishListLine={wishListLine}
                        product={products[index]}
                        onDeleteClick={deleteClickHandler}
                        onEditNotesClick={editNotesClickHandler} />
                </GridItem>)
            }
            <GridItem {...styles.paginationGridItem} data-test-selector="pagination">
                <Pagination
                    {...styles.pagination}
                    currentPage={pagination.currentPage}
                    resultsPerPage={pagination.pageSize}
                    resultsCount={pagination.totalItemCount}
                    resultsPerPageOptions={pagination.pageSizeOptions}
                    onChangePage={changePageHandler}
                    onChangeResultsPerPage={changeResultsPerPageHandler} />
            </GridItem>
        </GridContainer>
        <TwoButtonModal
            modalIsOpen={deleteLineModalIsOpen}
            headlineText={translate("Delete List Item")}
            messageText={`${translate("Are you sure you want to delete this item?")}`}
            cancelButtonText={translate("Cancel")}
            submitButtonText={translate("Delete")}
            onCancel={deleteCancelHandler}
            onSubmit={deleteSubmitHandler}
            submitTestSelector="submitDeleteListItem"
        />
        {wishListLineToAction
            && <Modal
                {...styles.editNotesModal}
                headline={translate(`${wishListLineToAction.notes ? "Edit" : "Add"} Notes`)}
                isOpen={editNotesModalIsOpen}
                handleClose={editNotesModalCancelHandler}
                sizeVariant="small">
                <EditNotesForm wishListLine={wishListLineToAction} onCancel={editNotesModalCancelHandler} onSubmit={editNotesModalSubmitHandler} />
            </Modal>
        }
    </>;
};

interface EditNotesFormProps {
    wishListLine: WishListLineModel;
    onCancel: () => void;
    onSubmit: (notes: string) => void;
}

const EditNotesForm: React.FC<EditNotesFormProps> = ({
    wishListLine,
    onCancel,
    onSubmit,
}) => {
    const [notes, setNotes] = React.useState(wishListLine.notes);
    const notesChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(event.target.value.length > 300 ? event.target.value.slice(0, 300) : event.target.value);
    };

    const deleteHandler = () => {
        setNotes("");
        onSubmit("");
    };

    return <>
        <TextArea {...styles.notesTextArea} value={notes} onChange={notesChangeHandler} hint={`${300 - notes.length} ${translate("characters left")}`} />
        <StyledWrapper {...styles.editNotesModalButtonsWrapper}>
            {wishListLine.notes
                && <Button {...styles.editNotesModalDeleteButton} onClick={deleteHandler}>{translate("Delete Note")}</Button>
            }
            <Button {...styles.editNotesModalCancelButton} onClick={onCancel}>{translate("Cancel")}</Button>
            <Button {...styles.editNotesModalSubmitButton} onClick={() => onSubmit(notes)}>
                {translate(`${wishListLine.notes ? "Save" : "Add Notes"}`)}
            </Button>
        </StyledWrapper>
    </>;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListsDetailsProductList),
    definition: {
        group: "My Lists Details",
        displayName: "Product List",
        allowedContexts: [MyListsDetailsPageContext],
        isSystem: true,
    },
};

export default widgetModule;
