import React from "react";
import { css } from "styled-components";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import translate from "@insite/client-framework/Translate";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import siteMessage from "@insite/client-framework/SiteMessage";
import addWishListLines from "@insite/client-framework/Store/Pages/MyLists/Handlers/AddWishListLines";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import addWishList from "@insite/client-framework/Store/Pages/MyLists/Handlers/AddWishList";
import DynamicDropdown, { OptionObject, DynamicDropdownPresentationProps } from "@insite/mobius/DynamicDropdown";
import { getWishListsDataView, getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";

interface OwnProps {
    onCancel: () => void;
    onSubmit: (name: string, wishListId: string) => void;
}

interface State {
    name: string;
    nameError?: React.ReactNode;
    wishListId?: string;
    destinationWishList?: WishListModel;
}

const mapStateToProps = (state: ApplicationState) => ({
    wishLists: getWishListsDataView(state, state.pages.myLists.getWishListsParameter).value,
    wishList: getWishListState(state, state.pages.myListDetails.wishListId).value,
    wishListLines: getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter).value,
});

const mapDispatchToProps = {
    addWishListLines,
    createList: addWishList,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface MyListsDetailsCopyListFormStyles {
    container?: GridContainerProps;
    nameGridItem?: GridItemProps;
    nameTextField?: TextFieldProps;
    wishListGridItem?: GridItemProps;
    wishListDynamicDropdown?: DynamicDropdownPresentationProps;
    descriptionGridItem?: GridItemProps;
    descriptionText?: TypographyProps;
    buttonsGridItem?: GridItemProps;
    cancelButton?: ButtonPresentationProps;
    createButton?: ButtonPresentationProps;
}

const styles: MyListsDetailsCopyListFormStyles = {
    nameGridItem: {
        width: 12,
    },
    nameTextField: {
        border: "rectangle",
    },
    wishListGridItem: {
        width: 12,
    },
    descriptionGridItem: {
        width: 12,
    },
    buttonsGridItem: {
        width: 12,
        css: css` justify-content: flex-end; `,
    },
    cancelButton: {
        color: "secondary",
        css: css` margin-right: 10px; `,
    },
};

export const copyListFormStyles = styles;

class MyListsDetailsCopyListForm extends React.Component<Props, State> {

    static contextType = ToasterContext;
    context!: React.ContextType<typeof ToasterContext>;

    readonly CREATE_ID = "CREATE_ID";

    constructor(props: Props) {
        super(props);
        this.state = {
            name: "",
            wishListId: this.CREATE_ID,
        };
    }

    submitHandler = (e: any) => {
        if (this.state.wishListId === this.CREATE_ID) {
            if (this.state.name === "") {
                this.setState({
                    nameError: siteMessage("Lists_Enter_New_Wishlist_Name"),
                });
                return;
            }

            this.props.createList({
                apiParameter: { name: this.state.name, description: "" },
                onSuccess: this.onCreateSuccess,
                onError: this.onCreateError,
            });
        } else if (this.props.wishLists) {
            const destinationWishList = this.props.wishLists?.find(w => w.id === this.state.wishListId);
            if (destinationWishList) {
                this.setState({
                    destinationWishList,
                });
                this.copyWishList(destinationWishList);
            }
        }
    };

    onCreateSuccess = (addedWishList: WishListModel) => {
        this.setState({
            destinationWishList: addedWishList,
        });
        this.copyWishList(addedWishList);
    };

    onCreateError = (errorMessage: string) => {
        this.setState({ nameError: errorMessage });
    };

    private copyWishList(destinationWishList: WishListModel) {
        if (destinationWishList && this.props.wishListLines) {
            this.props.addWishListLines({
                apiParameter: {
                    wishList: destinationWishList,
                    lines: this.props.wishListLines.map(line => ({
                        productId: line.productId,
                        qtyOrdered: line.qtyOrdered,
                        unitOfMeasure: line.unitOfMeasure,
                    })),
                },
                reloadWishLists: false,
                onSuccess: this.onCopySuccess,
            });
        }
        this.props.onSubmit(this.state.name, this.state.wishListId as string);
    }

    nameChangeHandler = (e: any) => {
        this.setState({
            name: e.target.value,
            nameError: "",
        });
    };

    wishListChangeHandler = (value?: string) => {
        this.setState({
            wishListId: value,
        });
    };

    onCopySuccess = () => {
        if (this.state.destinationWishList) {
            this.context.addToast({
                body: translate("Item(s) copied to ") + this.state.destinationWishList.name,
                messageType: "success",
            });
        }
    };

    render() {
        let options: OptionObject[] = [{ optionText: translate("Create New List"), optionValue: this.CREATE_ID }];
        if (this.props.wishLists) {
            const filteredWishLists = this.props.wishLists.filter(o => o.id !== this.props.wishList?.id);
            options = options.concat(filteredWishLists.map(wishList => (
                { optionText: wishList.name, optionValue: wishList.id }
            )));
        }

        return (
            <GridContainer {...styles.container} data-test-selector="copyListForm">
                <GridItem {...styles.descriptionGridItem}>
                    <Typography {...styles.descriptionText}>{translate("Copy items to a new or existing list.")}</Typography>
                </GridItem>
                <GridItem {...styles.wishListGridItem}>
                    <DynamicDropdown
                        label={translate("Select List")}
                        {...styles.wishListDynamicDropdown}
                        onSelectionChange={this.wishListChangeHandler}
                        selected={this.CREATE_ID}
                        options={options}
                        data-test-selector="selectList"
                    />
                </GridItem>
                {this.state.wishListId === this.CREATE_ID
                    && <GridItem {...styles.nameGridItem}>
                        <TextField
                            label={translate("List Name")}
                            {...styles.nameTextField}
                            name="name"
                            error={this.state.nameError}
                            required
                            defaultValue={this.state.name}
                            onChange={this.nameChangeHandler}>
                        </TextField>
                    </GridItem>
                }
                <GridItem {...styles.buttonsGridItem}>
                    <Button
                        {...styles.cancelButton}
                        onClick={this.props.onCancel}>
                        {translate("Cancel")}
                    </Button>
                    <Button {...styles.createButton} onClick={this.submitHandler} data-test-selector="submitCopyListButton">
                        {translate("Copy to List")}
                    </Button>
                </GridItem>
            </GridContainer>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyListsDetailsCopyListForm);
