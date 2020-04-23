import * as React from "react";
import {
    createWidgetElement,
    registerWidgetUpdate,
    unregisterWidgetUpdate,
} from "@insite/client-framework/Components/ContentItemStore";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import styled from "styled-components";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import { sendToShell } from "@insite/client-framework/Components/ShellHole";
import logger from "@insite/client-framework/Logger";
import {
    beginDraggingWidget,
    endDraggingWidget,
} from "@insite/client-framework/Store/UNSAFE_CurrentPage/CurrentPageActionCreators";
import Icon from "@insite/mobius/Icon";
import Trash2 from "@insite/mobius/Icons/Trash2";
import Edit from "@insite/mobius/Icons/Edit";

interface OwnProps {
    id: string;
    type: string;
    fixed: boolean;
}

interface State {
    hasError: boolean;
    error?: Error;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => {
    return {
        widget: state.UNSAFE_currentPage.widgetsById[ownProps.id],
        draggingWidgetId: state.UNSAFE_currentPage.draggingWidgetId,
    };
};

const mapDispatchToProps = {
    beginDraggingWidget,
    endDraggingWidget,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps & HasShellContext;

const ErrorWithWidgetStyle = styled.div`
    color: red;
`;

class WidgetRenderer extends React.Component<Props, State> {
    private readonly widgetHover = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(error: Error) {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        logger.error(error);
    }

    componentDidMount() {
        if (module.hot) {
            this.forceUpdate = this.forceUpdate.bind(this);
            registerWidgetUpdate(this.forceUpdate);
        }
    }

    componentWillUnmount() {
        if (module.hot) {
            unregisterWidgetUpdate(this.forceUpdate);
        }
    }

    editWidget = () => {
        sendToShell({
            type: "EditWidget",
            id: this.props.id,
        });
    };

    removeWidget = () => {
        sendToShell({
            type: "ConfirmWidgetDeletion",
            id: this.props.id,
            widgetType: this.props.widget.type,
        });
    };

    dragHandleMouseDown = () => {
        if (this.props.fixed) {
            return;
        }
        this.widgetHover.current!.setAttribute("draggable", "true");
    };

    dragStart = () => {
        this.props.beginDraggingWidget(this.props.widget!.id);
        setTimeout(() => {
            const { current } = this.widgetHover;
            current!.style.display = "none";
            current!.parentElement!.parentElement!.setAttribute("data-dragging", "");
        });
    };

    dragEnd = () => {
        const { current } = this.widgetHover;
        current!.setAttribute("draggable", "false");
        current!.parentElement!.parentElement!.removeAttribute("data-dragging");
        current!.style.display = "";
        this.props.endDraggingWidget();
    };

    render() {
        const { type, widget, draggingWidgetId, shellContext, fixed } = this.props;

        const { isEditing, isCurrentPage, isInShell } = shellContext;

        if (this.state.hasError) {
            if (isInShell) {
                return <ErrorWithWidgetStyle>There was an unhandled exception that occurred while trying to render the
                    widget: {this.state.error}.
                    See the console for more details.</ErrorWithWidgetStyle>;
            }

            return <ErrorWithWidgetStyle>An error occurred.</ErrorWithWidgetStyle>;
        }

        const widgetElement = createWidgetElement(type, widget);

        if (isInShell && isEditing && isCurrentPage) {
            // this extra div appears necessary to make sure data-widget shows up if the server renders the wrong version of isInShell
            return <div data-widget={type}>
                <WidgetStyle>
                    {(!draggingWidgetId || draggingWidgetId === widget.id)
                        && <HoverStyle ref={this.widgetHover} onDragStart={this.dragStart} onDragEnd={this.dragEnd} data-test-selector={`widgetHover_${type}`}>
                            <WidgetHoverNameStyle fixed={fixed} onMouseDown={this.dragHandleMouseDown} data-test-selector="widgetHover_title">{widget.type}</WidgetHoverNameStyle>
                            <IconLink onClick={this.editWidget} data-test-selector="widgetHover_edit" title="Edit">
                                <Icon src={Edit} size={20} color="#fff" />
                            </IconLink>
                            {!fixed
                            && <IconLink onClick={this.removeWidget} title="Delete" data-test-selector="widgetHover_delete">
                                <Icon src={Trash2} size={20} color="#fff" />
                            </IconLink>
                            }
                        </HoverStyle>
                    }
                    <WidgetWrapper>
                        {draggingWidgetId === widget.id
                            && <WidgetDisabler/>
                        }
                        {widgetElement}
                        <WidgetClearer></WidgetClearer>
                    </WidgetWrapper>
                </WidgetStyle>
            </div>;
        }
        if (isInShell && isCurrentPage) {
            return <div data-widget={type}>{widgetElement}</div>;
        }

        return widgetElement;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withIsInShell(WidgetRenderer));

const IconLink = styled.a`
    svg:hover {
        color: #fff;
    }
`;

const HoverStyle = styled.div`
    display: none;
    position: absolute;
    background-color: #4a4a4a;
    color: white;
    top: 42px;
    left: 4px;
    transform: translate(0, -100%);
    align-items: center;
    z-index: 10;
    a {
        padding: 9px 6px 5px;
        cursor: pointer;
    }
    a:hover {
        background-color: black;
    }
`;

const WidgetHoverNameStyle = styled.span<{ fixed: boolean }>`
    padding: 0 12px;
    margin-right: 20px;
    font-weight: 300;
    font-size: 15px;
    letter-spacing: 0.5px;
    cursor: ${props => !props.fixed ? "grab" : "auto"};
    white-space: nowrap;
`;

const WidgetWrapper = styled.div`
    border: 1px solid #999;
    min-height: 8px;
    padding: 1px;
    &[data-dragging='true'] {
        background-color: grey;
    }
    position: relative;
`;

const WidgetStyle = styled.div`
    padding: 40px 4px 4px;
    position: relative;

    &:hover > ${WidgetWrapper} {
        border: 2px solid #000;
        padding: 0;
    }

    &:hover > ${HoverStyle} {
        display: flex;
    }
`;

const WidgetDisabler = styled.div`
    background-color: rgba(150, 150, 150, 0.5);
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 10;
`;

const WidgetClearer = styled.div`
    clear: both;
`;
