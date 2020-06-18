import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    updateField,
    addWidget,
    removeWidget,
    replaceItem,
    UpdateFieldParameter, endDraggingWidget, beginDraggingWidget,
    setWidgetDefinitions,
    setPageDefinitions,
} from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { cleanupAfterDragging } from "@insite/client-framework/WidgetReordering";
import setLanguage from "@insite/client-framework/Store/Context/Handlers/SetLanguage";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ItemProps } from "@insite/client-framework/Types/PageProps";
import { loadPageLinks } from "@insite/client-framework/Store/Links/LinksActionCreators";
import { initializeSiteHole } from "@insite/client-framework/Components/ShellHole";
import { selectBrand, selectCategory, selectProduct, setCMSPermissions } from "@insite/client-framework/Store/Context/ContextActionCreators";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { History } from "@insite/mobius/utilities/HistoryContext";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { WidgetDefinition, PageDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import { SafeDictionary } from "@insite/client-framework/Common/Types";

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
    setWidgetDefinitions,
    setPageDefinitions,
};

type Props =
    ReturnType<typeof mapStateToProps>
    & ResolveThunks<typeof mapDispatchToProps>
    & OwnProps;

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
            LoadUrl: ({ url }: { url: string; }) => {
                props.history.push(url);
            },
            UpdateField: (data: UpdateFieldParameter) => {
                this.props.updateField(data);
            },
            BeginDraggingWidget: ({ id }: { id: string; }) => {
                this.props.beginDraggingWidget(id);
            },
            EndDraggingWidget: () => {
                cleanupAfterDragging();
                this.props.endDraggingWidget();
            },
            AddWidget: ({ widget, sortOrder }: { widget: WidgetProps; sortOrder: number; }) => {
                this.props.addWidget(widget, sortOrder, props.page.id);
            },
            RemoveWidget: ({ id }: { id: string; }) => {
                this.props.removeWidget(id);
            },
            ReplaceItem: ({ item }: { item: ItemProps; }) => {
                this.props.replaceItem(item);
            },
            ChangeLanguage: ({ languageId }: { languageId: string; }) => {
                this.props.setLanguage({ languageId });
            },
            SelectProduct: ({ productPath }: { productPath: string; }) => {
                this.props.selectProduct(productPath);
            },
            SelectCategory: ({ categoryPath }: { categoryPath: string; }) => {
                this.props.selectCategory(categoryPath);
            },
            SelectBrand: ({ brandPath }: { brandPath: string; }) => {
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
            CMSPermissions: ({ permissions }: { permissions: PermissionsModel; }) => {
                this.props.setCMSPermissions(permissions);
            },
            WidgetDefinitions: ({ widgetDefinitionsByType }: { widgetDefinitionsByType: SafeDictionary<WidgetDefinition>; }) => {
                this.props.setWidgetDefinitions(widgetDefinitionsByType);
            },
            PageDefinitions: ({ pageDefinitionsByType }: { pageDefinitionsByType: SafeDictionary<PageDefinition>; }) => {
                this.props.setPageDefinitions(pageDefinitionsByType);
            },
        });
    }

    render() {
        return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShellHoleProvider);
