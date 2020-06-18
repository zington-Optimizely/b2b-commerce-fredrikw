import * as React from "react";
import styled from "styled-components";
import { connect, ResolveThunks } from "react-redux";
import ShellState from "@insite/shell/Store/ShellState";
import AddWidgetModal from "@insite/shell/Components/Modals/AddWidgetModal";
import { sendToSite, setSiteFrame } from "@insite/shell/Components/Shell/SiteHole";
import { RouteComponentProps, withRouter } from "react-router";
import {
    addWidget,
    moveWidgetTo,
    removeWidget,
    changeContext,
} from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { displayAddWidgetModal, editWidget, savePage } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { AddWidgetData } from "@insite/client-framework/Common/FrameHole";
import { HasConfirmationContext, withConfirmation } from "@insite/shell/Components/Modals/ConfirmationContext";
import { PersonaModel } from "@insite/client-framework/Types/ApiModels";
import { getWidgetDefinitions, getPageDefinitions } from "@insite/shell/DefinitionLoader";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { WidgetDefinition, PageDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";

interface OwnProps {
    pageId: string;
}

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => ({
    stageMode: state.shellContext.stageMode,
    isEditMode: state.shellContext.contentMode === "Editing",
    selectedProductPath: state.pageEditor.selectedProductPath,
    selectedCategoryPath: state.pageEditor.selectedCategoryPath,
    selectedBrandPath: state.pageEditor.selectedBrandPath,
    currentLanguageId: state.shellContext.currentLanguageId,
    currentPersonaId: state.shellContext.currentPersonaId,
    currentDeviceType: state.shellContext.currentDeviceType,
    draggingWidgetId: state.data.pages.draggingWidgetId,
    permissions: state.shellContext.permissions,
});

const mapDispatchToProps = {
    addWidget,
    moveWidgetTo,
    displayAddWidgetModal,
    editWidget,
    savePage,
    removeWidget,
    changeContext,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps & RouteComponentProps & HasConfirmationContext;

interface State {
    lastPageId: string;
}

class SiteFrame extends React.Component<Props, State> {
    private framePageId = "";

    componentDidUpdate(prevProps: Props) {
        if (this.props.draggingWidgetId && this.props.draggingWidgetId !== prevProps.draggingWidgetId) {
            sendToSite({
                type: "BeginDraggingWidget",
                id: this.props.draggingWidgetId,
            });
        } else if (!this.props.draggingWidgetId && this.props.draggingWidgetId !== prevProps.draggingWidgetId) {
            sendToSite({
                type: "EndDraggingWidget",
            });
        }

        if (this.props.currentLanguageId !== prevProps.currentLanguageId
            || this.props.currentPersonaId !== prevProps.currentPersonaId
            || this.props.currentDeviceType !== prevProps.currentDeviceType) {
            sendToSite({
                type: "ChangeLanguage",
                languageId: this.props.currentLanguageId,
            });
        }

        if (this.props.selectedProductPath !== prevProps.selectedProductPath) {
            sendToSite({
                type: "SelectProduct",
                productPath: this.props.selectedProductPath,
            });
        }

        if (this.props.selectedCategoryPath !== prevProps.selectedCategoryPath) {
            sendToSite({
                type: "SelectCategory",
                categoryPath: this.props.selectedCategoryPath,
            });
        }

        if (this.props.selectedBrandPath !== prevProps.selectedBrandPath) {
            sendToSite({
                type: "SelectBrand",
                brandPath: this.props.selectedBrandPath,
            });
        }
    }

    render() {
        const { pageId, stageMode, isEditMode, history: { location: { search } }, permissions } = this.props;

        const url = pageId.startsWith("SwitchTo") ? (pageId.replace("SwitchTo", "") + search) : `/Content/Page/${pageId}`;

        if (this.framePageId !== pageId) {
            sendToSite({
                type: "LoadUrl",
                url,
            });
        }

        return <SiteFrameStyle stageMode={stageMode}>
            {isEditMode && permissions?.canAddWidget
                && <>
                <AddWidgetModal/>
                </>
            }
            <ActualFrame url={url || "/"} onLoad={this.onLoad} />
        </SiteFrameStyle>;
    }

    onLoad = (event: React.MouseEvent<HTMLIFrameElement>) => {
        const iframe = event.currentTarget;
        const iframeWindow = iframe.contentWindow as WindowProxy;

        const bubbleEvent = (eventType: "mousemove" | "click" | "mousedown") => {
            iframeWindow.addEventListener(eventType, (event: MouseEvent) => {
                const boundingClientRect = iframe.getBoundingClientRect();
                const bubbledEvent = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: false,
                    // we add these just to later remove them because the SiteFrameStyle mouseMove has to remove them.
                    clientX: event.clientX + boundingClientRect.left,
                    clientY: event.clientY + boundingClientRect.top,
                });
                iframe.dispatchEvent(bubbledEvent);
            });
        };

        bubbleEvent("mousemove");
        bubbleEvent("click");
        bubbleEvent("mousedown");

        setSiteFrame(iframe, {
            LoadPageComplete: (data: { pageId: string }) => {
                const url = `/ContentAdmin/Page/${data.pageId}`;
                this.framePageId = data.pageId;
                this.props.history.push(url);

                let attempts = 15;
                const widgetDefinitions = getWidgetDefinitions();
                const widgetDefinitionsByType: SafeDictionary<WidgetDefinition> = {};
                widgetDefinitions.forEach(definition => {
                    widgetDefinitionsByType[definition.type] = { isSystem: definition.isSystem } as WidgetDefinition;
                });

                const pageDefinitions = getPageDefinitions();
                const pageDefinitionsByType: SafeDictionary<PageDefinition> = {};
                pageDefinitions.forEach(definition => {
                    pageDefinitionsByType[definition.type] = { isSystemPage: definition.isSystemPage } as PageDefinition;
                });

                const interval = setInterval(() => {
                    if ((sendToSite({
                        type: "CMSPermissions",
                        permissions: this.props.permissions,
                    }) && sendToSite({
                        type: "WidgetDefinitions",
                        widgetDefinitionsByType,
                    }) && sendToSite({
                        type: "PageDefinitions",
                        pageDefinitionsByType,
                    })) || !attempts--) clearInterval(interval);
                }, 200);
            },
            MoveWidgetTo: (data: { id: string, parentId: string, zoneName: string, index: number}) => {
                this.props.moveWidgetTo(data.id, data.parentId, data.zoneName, data.index);
                this.props.savePage();
            },
            AddWidget: (data: { widget: WidgetProps, index: number, pageId: string }) => {
                this.props.addWidget(data.widget, data.index, data.pageId);
                this.props.editWidget(data.widget.id, true);
            },
            AddRow: (data: AddWidgetData) => {
                this.props.displayAddWidgetModal(data);
            },
            DisplayWidgetModal: (data: AddWidgetData) => {
                this.props.displayAddWidgetModal(data);
            },
            EditWidget: (data: { id: string }) => {
                this.props.editWidget(data.id);
            },
            ConfirmWidgetDeletion: (data: { id: string, widgetType: string }) => {
                this.props.confirmation.display({
                    message: "Are you sure you want to delete this widget?",
                    title: `Delete ${data.widgetType}`,
                    onConfirm: () => {
                        sendToSite({
                            type: "RemoveWidget",
                            id: data.id,
                        });
                        this.props.removeWidget(data.id);
                        this.props.savePage();
                    },
                });
            },
            ChangeWebsiteLanguage: (data: { languageId: string }) => {
                this.props.changeContext(data.languageId, this.props.currentPersonaId, this.props.currentDeviceType);
            },
            FrontEndSessionLoaded: (data: { personas: PersonaModel[] }) => {
                if (!data.personas.length) return;
                this.props.changeContext(this.props.currentLanguageId, data.personas[0].id, this.props.currentDeviceType);
            },
        });
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withConfirmation(SiteFrame)));

const SiteFrameStyle = styled.div<Pick<ShellState["shellContext"], "stageMode">>`
    position: relative;
    width: 100%;
    height: 100%;
    iframe {
        width: 100%;
        height:
            ${/* sc-value */({ stageMode }) => {
                switch (stageMode) {
                case "Desktop": return "calc(100% - 31px)";
                case "Tablet": return "976px";
                case "Phone": return "765px";
                }
            }};
        border: none;
    }
`;

class ActualFrame extends React.Component<{ url: string, onLoad: (event: React.MouseEvent<HTMLIFrameElement>) => void }> {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <iframe id="siteIFrame" src={this.props.url} onLoad={this.props.onLoad}/>;
    }
}
