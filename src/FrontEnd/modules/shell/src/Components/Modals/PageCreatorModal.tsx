import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import ShellState from "@insite/shell/Store/ShellState";
import ButtonBar from "@insite/shell/Components/Modals/ButtonBar";
import Modal from "@insite/mobius/Modal";
import Button from "@insite/mobius/Button";
import styled from "styled-components";
import { toggleShowGeneratedPageCreator } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { getStorablePage } from "@insite/shell/Store/ShellSelectors";

interface OwnProps {}

interface PageEditorState {
    id: string;
}

const mapStateToProps = (state: ShellState) => ({
    show: state.pageEditor.showGeneratedPageCreator,
    getStorablePage: () => {
        return getStorablePage(state, state.shellContext.websiteId);
    },
});

const mapDispatchToProps = {
    toggleShowGeneratedPageCreator,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

class PageCreatorModal extends React.Component<Props, PageEditorState> {
    private textarea: HTMLTextAreaElement | null = null;

    generatePageCreator = () => {
        return JSON.stringify(this.props.getStorablePage(), null, 4);
    };

    copyGeneratedPage = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (this.textarea === null) {
            return;
        }

        this.textarea.select();
        document.execCommand("copy");
        event.currentTarget.focus();
    };

    render() {
        if (!this.props.show) {
            return null;
        }
        return <Modal
            isOpen={this.props.show}
            headline="Code for Page Creator"
            handleClose={this.props.toggleShowGeneratedPageCreator}
            closeOnEsc
            closeOnScrimClick
        >
            <p>Save this to wwwroot/Creators/{this.props.getStorablePage().type}.json</p>
            <TextAreaStyle ref={textarea => { this.textarea = textarea; }} value={this.generatePageCreator()} />
            <ButtonBar>
                <Button variant="secondary" onClick={this.props.toggleShowGeneratedPageCreator}>Close</Button>
                <Button variant="primary" onClick={this.copyGeneratedPage}>Copy</Button>
            </ButtonBar>
        </Modal>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageCreatorModal);

const TextAreaStyle = styled.textarea`
    width: 100%;
    height: 500px;
`;
