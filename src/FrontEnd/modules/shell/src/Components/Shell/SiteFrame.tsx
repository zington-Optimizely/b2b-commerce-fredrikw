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
} from "@insite/client-framework/Store/UNSAFE_CurrentPage/CurrentPageActionCreators";
import { displayAddWidgetModal, editWidget, savePage } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { AddWidgetData } from "@insite/client-framework/Common/FrameHole";
import { HasConfirmationContext, withConfirmation } from "@insite/shell/Components/Modals/ConfirmationContext";

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
    draggingWidgetId: state.currentPage.draggingWidgetId,
});

const mapDispatchToProps = {
    addWidget,
    moveWidgetTo,
    displayAddWidgetModal,
    editWidget,
    savePage,
    removeWidget,
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
        const { pageId, stageMode, isEditMode, history: { location: { search } } } = this.props;

        const url = pageId.startsWith("SwitchTo") ? (pageId.replace("SwitchTo", "") + search) : `/Content/Page/${pageId}`;

        if (this.framePageId !== pageId) {
            sendToSite({
                type: "LoadUrl",
                url,
            });
        }

        return <SiteFrameStyle stageMode={stageMode}>
            {isEditMode
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
            LoadPageComplete: (data: { page: PageModel }) => {
                const url = `/ContentAdmin/Page/${data.page.id}`;
                this.framePageId = data.page.id;
                this.props.history.push(url);
            },
            MoveWidgetTo: (data: { id: string, parentId: string, zoneName: string, index: number}) => {
                this.props.moveWidgetTo(data.id, data.parentId, data.zoneName, data.index);
                this.props.savePage();
            },
            AddWidget: (data: { widget: WidgetProps, index: number}) => {
                this.props.addWidget(data.widget, data.index);
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
