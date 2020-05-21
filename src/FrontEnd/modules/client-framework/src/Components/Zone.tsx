import * as React from "react";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import { getWidgetsByIdAndZone } from "@insite/client-framework/Store/Data/Widgets/WidgetSelectors";
import WidgetRenderer from "@insite/client-framework/Components/WidgetRenderer";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import { dragLeaveZone, dragWidgetOverZone, dropWidgetOnZone } from "@insite/client-framework/WidgetReordering";
import styled from "styled-components";
import { moveWidgetTo } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { sendToShell } from "@insite/client-framework/Components/ShellHole";
import Icon from "@insite/mobius/Icon";
import PlusCircle from "@insite/mobius/Icons/PlusCircle";

export interface OwnProps {
    contentId: string;
    zoneName: string;
    fixed?: boolean;
    requireRows?: boolean;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    widgets: getWidgetsByIdAndZone(state, ownProps.contentId, ownProps.zoneName),
    draggingWidgetId: state.data.pages.draggingWidgetId,
});

const mapDispatchToProps = {
    moveWidgetTo,
};

export type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps & HasShellContext;

class Zone extends React.Component<Props> {
    private dropWidget = (event: React.DragEvent<HTMLElement>) => {
        const { contentId, draggingWidgetId, zoneName } = this.props;

        if (draggingWidgetId) {
            dropWidgetOnZone(event, index => {
                sendToShell({
                    type: "MoveWidgetTo",
                    id: draggingWidgetId,
                    parentId: contentId,
                    zoneName,
                    index,
                });
                this.props.moveWidgetTo(draggingWidgetId, contentId, zoneName, index);
            });
        }
    };

    private dragOver = (event: React.DragEvent<HTMLDivElement>) => {
        if (this.props.fixed) {
            return;
        }
        dragWidgetOverZone(event);
    };

    private dragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        if (this.props.fixed) {
            return;
        }
        dragLeaveZone(event);
    };

    private add = () => {
        const { contentId, zoneName, widgets, requireRows } = this.props;

        sendToShell({
            type: "DisplayWidgetModal",
            parentId: contentId,
            zoneName,
            sortOrder: widgets.length,
            addRow: requireRows,
        });
    };

    render() {
        const { contentId, fixed, widgets, draggingWidgetId, zoneName, shellContext: { isEditing, isCurrentPage } } = this.props;

        if (!contentId) {
            return null;
        }

        const renderedWidgets = widgets.length === 0 && isEditing && isCurrentPage
            ? (draggingWidgetId ? <ZonePlaceholder data-zoneplaceholder /> : null)
            : widgets.map(widget => <WidgetRenderer key={widget.id} id={widget.id} type={widget.type} fixed={!!fixed}/>);

        if (isEditing && isCurrentPage) {
            return <ZoneStyle data-contentid={contentId}
                              onDrop={this.dropWidget}
                              onDragOver={this.dragOver}
                              onDragLeave={this.dragLeave}
            >
                <ZoneWrapper data-dragging={!!draggingWidgetId} data-empty={widgets.length === 0} data-zone>
                    {renderedWidgets}
                    {!draggingWidgetId && !this.props.fixed
                        && <AddContainer fullHeight={widgets.length === 0}>
                            <AddButton onClick={this.add} data-test-selector={`shell_addWidget_${zoneName}`}>
                                <Icon src={PlusCircle} size={26} color="#4A4A4A" />
                            </AddButton>
                        </AddContainer>
                    }
                </ZoneWrapper>
            </ZoneStyle>;
        }

        return <Wrapper>{renderedWidgets}</Wrapper>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withIsInShell(Zone));

const Wrapper = styled.div`
    width: 100%;
`;

const ZoneStyle = styled.div`
    min-height: 20px;
    height: 100%;
    width: 100%;
`;

const ZoneWrapper = styled.div`
    border: 2px solid #0072bc;
    margin: 6px;
    height: calc(100% - 12px);
    width: calc(100% - 12px);
    &[data-dragging='true'] {
        padding-bottom: 42px;
    }
    padding-top: 4px;
    &[data-dragging='true'][data-empty='true'] {
        padding-top: 4px;
    }
`;

const ZonePlaceholder = styled.div`
    display: flex;
    height: 100%;
    min-width: 50px;
`;

const AddContainer = styled.div<{ fullHeight: boolean}>`
    display: flex;
    justify-content: center;
    ${props => props.fullHeight ? "height: 100%" : ""};
`;

const AddButton = styled.div`
    cursor: pointer;
    padding: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 0 7px;
    svg:hover {
        color: #9b9b9b;
    }
`;
