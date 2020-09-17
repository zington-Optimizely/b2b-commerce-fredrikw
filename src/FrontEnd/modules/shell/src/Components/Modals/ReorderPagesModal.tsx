import Button from "@insite/mobius/Button";
import Icon from "@insite/mobius/Icon";
import AlertTriangle from "@insite/mobius/Icons/AlertTriangle";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import Modal from "@insite/mobius/Modal";
import Drag from "@insite/shell/Components/Icons/Drag";
import ButtonBar from "@insite/shell/Components/Modals/ButtonBar";
import { PageReorderModel } from "@insite/shell/Services/ContentAdminService";
import shellTheme, { ShellThemeProps } from "@insite/shell/ShellTheme";
import { cancelReorderPages, saveReorderPages } from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

interface OwnProps {}

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => {
    return {
        displayReorderPages: state.pageTree.displayReorderPages,
        reorderPagesByParentId: state.pageTree.reorderPagesByParentId,
        homeNodeId: state.pageTree.homeNodeId,
        savingReorderPages: state.pageTree.savingReorderPages,
    };
};

const mapDispatchToProps = {
    cancelReorderPages,
    saveReorderPages,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

class ReorderPagesModal extends React.Component<Props> {
    private readonly reorderTree: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);

        this.state = {
            draggingKey: "",
            oldParentId: "",
        };

        this.reorderTree = React.createRef();
    }

    cancel = () => {
        this.props.cancelReorderPages();
    };

    save = () => {
        const pages: PageReorderModel[] = [];
        this.reorderTree.current!.querySelectorAll("ul").forEach(listElement => {
            const parentId = listElement.getAttribute("data-id") as string;
            let sortOrder = 0;
            listElement.childNodes.forEach(pageElement => {
                const id = (pageElement as HTMLElement).querySelector("h3")!.getAttribute("data-id") as string;
                if (!id) {
                    return;
                }
                pages.push({
                    name: id,
                    id,
                    parentId,
                    sortOrder,
                });

                sortOrder += 1;
            });
        });

        this.props.saveReorderPages(pages);
    };

    draggedElement?: HTMLElement;

    dragStart = (event: React.DragEvent<HTMLElement>) => {
        this.draggedElement = event.currentTarget;
        setTimeout(() => {
            this.draggedElement!.parentElement!.setAttribute("data-dragging", "");
        });

        return undefined;
    };

    dragEnd = (event: React.DragEvent<HTMLElement>) => {
        const target = event.currentTarget;
        setTimeout(() => {
            target.parentElement!.removeAttribute("data-dragging");
        });
        this.placeholder!.style.display = "none";
        this.draggedElement = undefined;
    };

    placeholder: HTMLElement | undefined = undefined;

    dragOver = (event: React.DragEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();

        if (typeof this.placeholder === "undefined") {
            this.placeholder = document.createElement("li");
            const placeholderChild = document.createElement("h3");
            placeholderChild.style.backgroundColor = "#ddd";
            placeholderChild.style.width = "120px";
            placeholderChild.innerHTML = "&nbsp;";
            this.placeholder.append(placeholderChild);
        }

        this.placeholder!.style.display = "";

        const theTarget = event.target as HTMLElement;

        // prevent someone from adding an item to one of it's children
        let parent = theTarget.parentElement;
        while (parent != null) {
            if (parent === this.draggedElement!.parentElement) {
                return;
            }
            parent = parent.parentElement;
        }

        const closestLi = theTarget.closest("li") as HTMLElement;
        if (closestLi) {
            const rect = closestLi.getBoundingClientRect();
            const relY = event.clientY - rect.top;
            const height = (rect.bottom - rect.top) / 2;

            const relX = event.clientX - rect.left;
            if (relX > 50) {
                const theUl = closestLi.querySelector("ul") as HTMLElement;

                if (theUl) {
                    // prevent someone from adding an item to itself
                    const id = theUl.getAttribute("data-id");
                    if (id && this.draggedElement!.getAttribute("data-id") === id) {
                        return;
                    }

                    if (
                        theUl.children.length === 0 ||
                        (theUl.children.length === 1 && theUl.children[0] === this.placeholder)
                    ) {
                        theUl.appendChild(this.placeholder);
                        return;
                    }
                }
                if (closestLi === this.placeholder && closestLi.previousSibling) {
                    ((closestLi.previousSibling as HTMLElement).querySelector("ul") as HTMLElement).appendChild(
                        this.placeholder,
                    );
                }
            }

            const parent = closestLi.parentNode as HTMLElement;
            if (relY > height) {
                parent.insertBefore(this.placeholder, closestLi.nextElementSibling);
            } else if (relY < height) {
                parent.insertBefore(this.placeholder, closestLi);
            }
        }
    };

    drag = (event: React.DragEvent<HTMLElement>) => {
        if (!this.draggedElement) {
            return;
        }

        const boundingClientRect = this.reorderTree.current!.getBoundingClientRect();

        const top = event.clientY - boundingClientRect.top;
        if (top < 40) {
            this.scroll(-10);
        } else if (top < 60) {
            this.scroll(-5);
        }

        const bottom = boundingClientRect.bottom - event.clientY;
        if (bottom < 40) {
            this.scroll(15);
        } else if (bottom < 60) {
            this.scroll(8);
        }
    };

    scroll = (step: number) => {
        this.reorderTree.current!.scrollTop += step;
    };

    dragLeaveArea = (event: React.DragEvent<HTMLElement>) => {
        const boundingRect = event.currentTarget.getBoundingClientRect();
        const clientX = event.clientX;
        const clientY = event.clientY;
        if (
            clientX < boundingRect.left ||
            clientX > boundingRect.left + boundingRect.width ||
            clientY < boundingRect.top ||
            clientY > boundingRect.top + boundingRect.height
        ) {
            this.placeholder!.style.display = "none";
        }
    };

    drop = (event: React.DragEvent<HTMLElement>) => {
        event.stopPropagation();

        this.placeholder!.parentElement!.insertBefore(
            this.draggedElement!.parentElement!,
            this.placeholder!.nextSibling,
        );

        this.placeholder!.style.display = "none";
    };

    renderTreeChunk(parentId: string) {
        const { reorderPagesByParentId } = this.props;

        return (
            <ul onDragOver={this.dragOver} onDrop={this.drop} data-id={parentId}>
                {reorderPagesByParentId![parentId] &&
                    reorderPagesByParentId![parentId].map(page => {
                        return (
                            <ReorderTreeItemStyle key={page.id}>
                                <TitleStyle
                                    data-id={page.id}
                                    draggable={true}
                                    onDragStart={this.dragStart}
                                    onDragEnd={this.dragEnd}
                                    onDrag={this.drag}
                                >
                                    <Drag color1={shellTheme.colors.text.accent} height={18} />
                                    {page.name}
                                </TitleStyle>
                                {this.renderTreeChunk(page.id)}
                            </ReorderTreeItemStyle>
                        );
                    })}
            </ul>
        );
    }

    render() {
        return (
            <Modal
                headline="Reorder Pages"
                isOpen={this.props.displayReorderPages}
                handleClose={this.cancel}
                size={500}
                closeOnEsc
                cssOverrides={{
                    modalContent: css`
                        padding: 0 0 15px 0;
                        overflow-y: hidden;
                    `,
                }}
            >
                {this.props.reorderPagesByParentId && this.props.reorderPagesByParentId[this.props.homeNodeId] ? (
                    <>
                        <ReorderTreeWarningStyle>
                            <Icon src={AlertTriangle} />
                            Warning: Moving pages will change their URL. Make sure to set up any necessary redirects for
                            relocated pages.
                        </ReorderTreeWarningStyle>
                        <ReorderTreeStyle onDragLeave={this.dragLeaveArea} ref={this.reorderTree}>
                            {this.props.reorderPagesByParentId && this.renderTreeChunk(this.props.homeNodeId)}
                        </ReorderTreeStyle>
                        <ButtonBar>
                            <Button variant="tertiary" onClick={this.cancel}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={this.save}
                                disabled={this.props.savingReorderPages}
                                css={css`
                                    margin-right: 30px;
                                `}
                            >
                                Save
                            </Button>
                        </ButtonBar>
                    </>
                ) : (
                    <>
                        <LoadingStyle>
                            <LoadingSpinner />
                        </LoadingStyle>
                        <ButtonBar>
                            <Button variant="tertiary" onClick={this.cancel}>
                                Cancel
                            </Button>
                        </ButtonBar>
                    </>
                )}
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReorderPagesModal);

const LoadingStyle = styled.div`
    text-align: center;
    padding-top: 20px;
`;

const TitleStyle = styled.h3`
    cursor: grab;
    position: relative;
    font-size: 18px;
    svg {
        position: absolute;
        top: 5px;
        left: 6px;
    }
`;

const ReorderTreeStyle = styled.div`
    max-height: calc(70vh - 65px);
    overflow-y: auto;
    padding: 5px 15px 15px 15px;
    h3 {
        display: inline-block;
        border: 1px solid ${(props: ShellThemeProps) => props.theme.colors.text.accent};
        border-radius: 3px;
        margin: 2px 0;
        padding: 0 8px 0 22px;
    }
`;

const ReorderTreeItemStyle = styled.li`
    &[data-dragging] {
        color: #ddd;
    }
    ul {
        padding-left: 10px;
        h3,
        ul {
            margin-left: 20px;
        }
        li {
            position: relative;
        }
        li::before {
            content: "";
            width: 2px;
            height: 100%;
            background-color: rgb(216, 216, 216);
            position: absolute;
            top: 4px;
            left: 0;
        }
        li:last-child::before {
            height: 10px;
        }
        li::after {
            content: "";
            width: 14px;
            height: 2px;
            background-color: rgb(216, 216, 216);
            position: absolute;
            top: 14px;
            left: 0;
        }
    }
`;

const ReorderTreeWarningStyle = styled.div`
    display: flex;
    padding: 10px 10px 5px 10px;
    background-color: ${(props: ShellThemeProps) => props.theme.colors.warning.main};
    svg {
        margin-right: 5px;
    }
`;
