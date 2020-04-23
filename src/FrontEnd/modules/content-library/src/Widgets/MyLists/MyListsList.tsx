import * as React from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { MyListsPageContext } from "@insite/content-library/Pages/MyListsPage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import CardList, { CardListStyles } from "@insite/content-library/Components/CardList";
import CardContainer, { CardContainerStyles } from "@insite/content-library/Components/CardContainer";
import WishListCard from "@insite/content-library/Components/WishListCard";
import TwoButtonModal from "@insite/content-library/Components/TwoButtonModal";
import deleteWishList from "@insite/client-framework/Store/Pages/MyLists/Handlers/DeleteWishList";
import { ModalPresentationProps } from "@insite/mobius/Modal";
import siteMessage from "@insite/client-framework/SiteMessage";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import addWishListToCart from "@insite/client-framework/Store/Pages/Cart/Handlers/AddWishListToCart";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { getWishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";

interface OwnProps extends WidgetProps {
}
interface State {
    wishListToDelete?: WishListModel;
    deleteListModalIsOpen: boolean;
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        wishLists: getWishListsDataView(state, state.pages.myLists.getWishListsParameter),
        getWishListsParameter: state.pages.myLists.getWishListsParameter,
    };
};

const mapDispatchToProps = {
    addWishListToCart,
    deleteWishList,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface MyListsListStyles {
    cardList?: CardListStyles;
    cardContainer?: CardContainerStyles;
    deleteListModal?:ModalPresentationProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    messageText?: TypographyProps;
}

const styles: MyListsListStyles = {
    deleteListModal: {
        sizeVariant: "small",
    },
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css` margin: auto; `,
    },
    messageText: {
        variant: "h4",
        css: css`
            display: block;
            margin: auto;
        `,
    },
};

export const listStyles = styles;

class MyListsList extends React.Component<Props, State> {

    static contextType = ToasterContext;
    context!: React.ContextType<typeof ToasterContext>;

    constructor(props: Props) {
        super(props);
        this.state = {
            deleteListModalIsOpen: false,
        };
    }

    deleteButtonClickHandler = (wishList: WishListModel) => {
        this.setState({
            wishListToDelete: wishList,
            deleteListModalIsOpen: true,
        });
    };

    formCancelHandler = () => {
        this.setState({ deleteListModalIsOpen: false });
    };

    formSubmitHandler = () => {
        this.setState({ deleteListModalIsOpen: false });
        if (this.state.wishListToDelete) {
            this.props.deleteWishList({ wishListId: this.state.wishListToDelete.id, onSuccess: this.onDeleteSuccess, reloadWishLists: true });
        }
    };

    onDeleteSuccess = () => {
        this.context.addToast({ body: translate("List Deleted"), messageType: "success" });
    };

    render() {
        if (!this.props.wishLists.value || this.props.wishLists.isLoading) {
            return <StyledWrapper {...styles.centeringWrapper}>
                        <LoadingSpinner {...styles.spinner} data-test-selector="myListsListSpinner"></LoadingSpinner>
                </StyledWrapper>;
        }

        if (this.props.wishLists.value.length === 0) {
            return <StyledWrapper {...styles.centeringWrapper}>
                <Typography {...styles.messageText}>
                    {this.props.getWishListsParameter.query ? siteMessage("Lists_NoResultsMessage") : siteMessage("Lists_NoListsFound")}
                </Typography>
            </StyledWrapper>;
        }

        return(
            <>
                <CardList extendedStyles={styles.cardList}>
                    {this.props.wishLists.value.map((wishList) =>  (
                        <CardContainer key={wishList.id} extendedStyles={styles.cardContainer}>
                            <WishListCard
                                wishList={wishList}
                                addWishListToCart={this.props.addWishListToCart}
                                deleteWishList={() => this.deleteButtonClickHandler(wishList)} />
                        </CardContainer>
                    ))}
                </CardList>
                <TwoButtonModal
                    modalIsOpen={this.state.deleteListModalIsOpen}
                    headlineText={translate("Delete List")}
                    messageText={`${translate("Are you sure you want to delete")} ${this.state.wishListToDelete ? this.state.wishListToDelete.name : ""}?`}
                    cancelButtonText={translate("Cancel")}
                    submitButtonText={translate("Delete")}
                    onCancel={this.formCancelHandler}
                    onSubmit={this.formSubmitHandler}
                    submitTestSelector="myListsListSubmitDelete">
                </TwoButtonModal>
            </>
        );
    }
}

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(MyListsList),
    definition: {
        group: "My Lists",
        displayName: "List",
        allowedContexts: [MyListsPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
