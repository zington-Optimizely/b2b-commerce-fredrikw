import React from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { MyListsDetailsPageContext } from "@insite/content-library/Pages/MyListsDetailsPage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import updateLoadWishListLinesParameter from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateLoadWishListLinesParameter";
import setAllWishListLinesIsSelected from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/SetAllWishListLinesIsSelected";
import addToWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/AddToWishList";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import Checkbox, { CheckboxProps } from "@insite/mobius/Checkbox";
import translate from "@insite/client-framework/Translate";
import siteMessage from "@insite/client-framework/SiteMessage";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import Search from "@insite/mobius/Icons/Search";
import debounce from "lodash/debounce";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import PlusCircle from "@insite/mobius/Icons/PlusCircle";
import OverflowMenu, { OverflowMenuProps } from "@insite/mobius/OverflowMenu";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import ChevronsUpDown from "@insite/mobius/Icons/ChevronsUpDown";
import getColor from "@insite/mobius/utilities/getColor";
import X from "@insite/mobius/Icons/X";
import Icon, { IconProps } from "@insite/mobius/Icon";
import ProductSelector from "@insite/content-library/Components/ProductSelector";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import { ProductModelExtended } from "@insite/client-framework/Services/ProductServiceV2";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadWishListIfNeeded from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListIfNeeded";

const mapStateToProps = (state: ApplicationState) => ({
    wishListSettings: getSettingsCollection(state).wishListSettings,
    wishListDataView: getWishListState(state, state.pages.myListDetails.wishListId),
    wishListLinesDataView: getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter),
    loadWishListLinesParameter: state.pages.myListDetails.loadWishListLinesParameter,
    selectedWishListLineIds: state.pages.myListDetails.selectedWishListLineIds,
});

const mapDispatchToProps = {
    updateLoadWishListLinesParameter,
    loadWishListIfNeeded,
    loadWishListLines,
    setAllWishListLinesIsSelected,
    addToWishList,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface MyListsDetailsOptionsStyles {
    wrapper?: InjectableCss;
    leftColumnWrapper?: InjectableCss;
    rightColumnWrapper?: InjectableCss;
    container?: GridContainerProps;
    selectAllGridItem?: GridItemProps;
    selectAll?: CheckboxProps;
    editSortOrder?: CheckboxProps;
    searchGridItem?: GridItemProps;
    addItemsGridItem?: GridItemProps;
    addItemsLink?: LinkPresentationProps;
    search?: TextFieldProps;
    sortByGridItem?: GridItemProps;
    sortByOverflowMenu?: OverflowMenuProps;
    sortByClickable?: ClickablePresentationProps;
    selectedSortByClickable?: ClickablePresentationProps;
    closeAddItemsToList?: IconProps;
}

const styles: MyListsDetailsOptionsStyles = {
    wrapper: {
        css: css`
            @media print { display: none; }
            display: flex;
            margin: 20px 0;
        `,
    },
    leftColumnWrapper: {
        css: css` width: calc(100% - 40px); `,
    },
    rightColumnWrapper: {
        css: css`
            display: flex;
            width: 40px;
            justify-content: center;
            align-items: flex-end;
        `,
    },
    container: {
        gap: 10,
        css: css` margin-top: 32px; `,
    },
    selectAllGridItem: {
        width: [12, 12, 6, 4, 3],
        css: css`
            align-items: center;
            ${({ theme }: { theme: BaseTheme }) =>
            breakpointMediaQueries(theme, [css` justify-content: space-between; `, css` justify-content: space-between; `, null, null, null])}
        `,
    },
    selectAll: {
        css: css` cursor: pointer; `,
    },
    editSortOrder: {
        css: css`
            cursor: pointer;
            margin-left: 30px;
        `,
    },
    searchGridItem: { width: [12, 12, 6, 4, 4] },
    addItemsGridItem: {
        width: [12, 12, 6, 4, 5],
        css: css` align-items: center; `,
    },
    addItemsLink: {
        icon: {
            iconProps: { src: PlusCircle },
        },
        typographyProps: { css: css` padding-left: 5px; ` },
    },
    search: {
        iconProps: { src: Search },
    },
    sortByOverflowMenu: {
        iconProps: { src: ChevronsUpDown },
    },
    selectedSortByClickable: {
        css: css` color: ${getColor("primary")}; `,
    },
    closeAddItemsToList: {
        src: X,
        css: css`
            margin: 8px;
            cursor: pointer;
        `,
    },
};

export const myListsDetailsOptionsStyles = styles;

const MyListsDetailsOptions: React.FC<Props> = ({
                                                    wishListSettings,
                                                    wishListDataView,
                                                    wishListLinesDataView,
                                                    loadWishListLinesParameter,
                                                    selectedWishListLineIds,
                                                    updateLoadWishListLinesParameter,
                                                    loadWishListIfNeeded,
                                                    loadWishListLines,
                                                    setAllWishListLinesIsSelected,
                                                    addToWishList,
                                                }) => {
    const toasterContext = React.useContext(ToasterContext);
    const [query, setQuery] = React.useState(loadWishListLinesParameter.query);
    const [addItemsToListIsOpen, setAddItemsToListIsOpen] = React.useState(false);
    const debouncedSearch = React.useCallback(debounce((query: string) => {
        if (!wishListDataView.value) {
            return;
        }

        updateLoadWishListLinesParameter({ query });
        loadWishListLines();
    }, 200), [wishListDataView]);

    if (!wishListDataView.value || !wishListSettings) {
        return null;
    }

    const wishList = wishListDataView.value;

    const searchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = event.target.value || "";
        setQuery(newQuery);
        debouncedSearch(newQuery);
    };

    const sortByChangeHandler = (sortBy: string) => {
        updateLoadWishListLinesParameter({ sort: sortBy });
        loadWishListLines();
    };

    const isAllSelected = wishListLinesDataView.value && wishListLinesDataView.value.length > 0
        && wishListLinesDataView.value.every(o => selectedWishListLineIds.indexOf(o.id) >= 0);

    const selectAllChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        const allWishListLineIds = value ? wishListLinesDataView?.value?.map(o => o.id) : undefined;
        setAllWishListLinesIsSelected({ isSelected: value, wishListLineIds: allWishListLineIds });
    };

    const addItemsToListClickHandler = () => {
        setAddItemsToListIsOpen(true);
    };

    const addProductToList = (product: ProductModelExtended) => {
        addToWishList({
            products: [product],
            selectedWishList: wishList,
            onSuccess: () => {
                toasterContext.addToast({ body: translate("Item Added"), messageType: "success" });
                loadWishListIfNeeded({ wishListId: wishList.id });
            },
        });
    };

    const canEditWishList = wishList.allowEdit || !wishList.isSharedList;

    return (
        <StyledWrapper {...styles.wrapper}>
            <StyledWrapper {...styles.leftColumnWrapper} >
                {!addItemsToListIsOpen
                && <GridContainer {...styles.container}>
                    <GridItem {...styles.searchGridItem}>
                        <TextField
                            {...styles.search}
                            placeholder={translate("Search products in list")}
                            value={query}
                            onChange={searchChangeHandler}
                            data-test-selector="wishListSearch"
                        />
                    </GridItem>
                    <GridItem {...styles.selectAllGridItem}>
                        <Checkbox {...styles.selectAll} checked={isAllSelected} onChange={selectAllChangeHandler} data-test-selector="selectAllItems">
                            {translate("Select All")}
                        </Checkbox>
                        {loadWishListLinesParameter.sort === "SortOrder" && !query && canEditWishList
                        && <Checkbox {...styles.editSortOrder} data-test-selector="editSortOrder">{translate("Edit Sort Order")}</Checkbox>
                        }
                    </GridItem>
                    <GridItem {...styles.addItemsGridItem}>
                        {canEditWishList
                            && <Link {...styles.addItemsLink} onClick={addItemsToListClickHandler} data-test-selector="addItems">
                                {translate("Add Items To List")}
                            </Link>
                        }
                    </GridItem>
                </GridContainer>
                }
                {addItemsToListIsOpen
                && <ProductSelector
                    selectButtonTitle={translate("Add to List")}
                    onSelectProduct={addProductToList}
                    productIsConfigurableMessage={siteMessage("ListUpload_CannotOrderConfigurable")}
                    productIsUnavailableMessage={siteMessage("Product_NotFound")}
                />
                }
            </StyledWrapper>
            <StyledWrapper {...styles.rightColumnWrapper}>
                {!addItemsToListIsOpen
                && <OverflowMenu position="end" {...styles.sortByOverflowMenu}>
                    {wishListLinesDataView.value && wishListLinesDataView.pagination?.sortOptions.map(sortOption =>
                        <Clickable
                            {...(sortOption.sortType === loadWishListLinesParameter.sort ? styles.selectedSortByClickable : styles.sortByClickable)}
                            key={sortOption.sortType}
                            onClick={() => sortByChangeHandler(sortOption.sortType)}
                        >
                            {sortOption.displayName}
                        </Clickable>)
                    }
                </OverflowMenu>
                }
                {addItemsToListIsOpen
                && <Icon {...styles.closeAddItemsToList} onClick={() => {
                    setAddItemsToListIsOpen(false);
                }}/>
                }
            </StyledWrapper>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListsDetailsOptions),
    definition: {
        group: "My Lists Details",
        displayName: "Options",
        allowedContexts: [MyListsDetailsPageContext],
        isSystem: true,
    },
};

export default widgetModule;
