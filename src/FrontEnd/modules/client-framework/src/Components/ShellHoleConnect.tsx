import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { initializeSiteHole } from "@insite/client-framework/Components/ShellHole";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    selectBrand,
    selectCategory,
    selectProduct,
    setCMSPermissions,
} from "@insite/client-framework/Store/Context/ContextActionCreators";
import setLanguage from "@insite/client-framework/Store/Context/Handlers/SetLanguage";
import {
    addWidget,
    beginDraggingWidget,
    endDraggingWidget,
    removeWidget,
    replaceItem,
    resetPageDataViews,
    setPageDefinitions,
    updateField,
    UpdateFieldParameter,
} from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { loadPageLinks } from "@insite/client-framework/Store/Links/LinksActionCreators";
import { PageDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import { ItemProps } from "@insite/client-framework/Types/PageProps";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { cleanupAfterDragging } from "@insite/client-framework/WidgetReordering";
import { History } from "@insite/mobius/utilities/HistoryContext";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps {
    history: History;
}

const mapStateToProps = (state: ApplicationState) => ({
    page: getCurrentPage(state),
});

const mapDispatchToProps = {
    updateField,
    addWidget,
    beginDraggingWidget,
    endDraggingWidget,
    removeWidget,
    replaceItem,
    setLanguage,
    selectProduct,
    selectCategory,
    selectBrand,
    loadPageLinks,
    setCMSPermissions,
    setPageDefinitions,
    resetPageDataViews,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

interface MainNavigation {
    close: () => void;
    openMenu: (index: number) => void;
}

let mainNavigation: MainNavigation;

export const setMainNavigation = (value: MainNavigation) => {
    mainNavigation = value;
};

class ShellHoleProvider extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        initializeSiteHole({
            LoadUrl: ({ url }: { url: string }) => {
                props.history.push(url);
            },
            UpdateField: (data: UpdateFieldParameter) => {
                this.props.updateField(data);
            },
            BeginDraggingWidget: ({ id }: { id: string }) => {
                this.props.beginDraggingWidget(id);
            },
            EndDraggingWidget: () => {
                cleanupAfterDragging();
                this.props.endDraggingWidget();
            },
            AddWidget: ({ widget, sortOrder, pageId }: { widget: WidgetProps; sortOrder: number; pageId: string }) => {
                this.props.addWidget(widget, sortOrder, pageId);
            },
            RemoveWidget: ({ id, pageId }: { id: string; pageId: string }) => {
                this.props.removeWidget(id, pageId);
            },
            ReplaceItem: ({ item }: { item: ItemProps }) => {
                this.props.replaceItem(item);
            },
            ChangeLanguage: ({ languageId }: { languageId: string }) => {
                this.props.setLanguage({ languageId });
            },
            SelectProduct: ({ productPath }: { productPath: string }) => {
                this.props.selectProduct(productPath);
            },
            SelectCategory: ({ categoryPath }: { categoryPath: string }) => {
                this.props.selectCategory(categoryPath);
            },
            SelectBrand: ({ brandPath }: { brandPath: string }) => {
                this.props.selectBrand(brandPath);
            },
            CloseMainNavigation: () => {
                mainNavigation?.close();
            },
            OpenMainNavigation: ({ index }: { index: number }) => {
                mainNavigation?.openMenu(index);
            },
            Reload: () => {
                window.location.reload();
            },
            ReloadPageLinks: () => {
                this.props.loadPageLinks();
            },
            ResetPageDataViews: () => {
                this.props.resetPageDataViews();
            },
            CMSPermissions: ({
                permissions,
                canChangePage,
            }: {
                permissions: PermissionsModel;
                canChangePage: boolean;
            }) => {
                this.props.setCMSPermissions(permissions, canChangePage);
            },
            PageDefinitions: ({
                pageDefinitionsByType,
            }: {
                pageDefinitionsByType: SafeDictionary<Pick<PageDefinition, "pageType">>;
            }) => {
                this.props.setPageDefinitions(pageDefinitionsByType);
            },
        });
    }

    render() {
        return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShellHoleProvider);
