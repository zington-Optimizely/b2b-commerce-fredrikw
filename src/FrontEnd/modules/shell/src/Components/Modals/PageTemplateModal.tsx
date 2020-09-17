import Button from "@insite/mobius/Button";
import Modal from "@insite/mobius/Modal";
import ButtonBar from "@insite/shell/Components/Modals/ButtonBar";
import { toggleShowGeneratedPageTemplate } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { getStorablePage } from "@insite/shell/Store/ShellSelectors";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

interface OwnProps {}

interface PageEditorState {
    id: string;
}

const mapStateToProps = (state: ShellState) => ({
    show: state.pageEditor.showGeneratedPageTemplate,
    getStorablePage: () => {
        return getStorablePage(state, state.shellContext.websiteId);
    },
});

const mapDispatchToProps = {
    toggleShowGeneratedPageTemplate,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

class PageTemplateModal extends React.Component<Props, PageEditorState> {
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

        const pathToSave =
            BLUEPRINT_NAME === "content-library"
                ? `wwwroot/AppData/PageTemplates/BuiltIn/${this.props.getStorablePage().type}/Standard.json`
                : `modules/blueprints/${BLUEPRINT_NAME}/wwwroot/AppData/PageTemplates/${
                      this.props.getStorablePage().type
                  }/Standard.json`;

        return (
            <Modal
                isOpen={this.props.show}
                headline="Code for Page Template"
                handleClose={this.props.toggleShowGeneratedPageTemplate}
                closeOnEsc
                closeOnScrimClick
            >
                <p>Save this to {pathToSave}</p>
                <TextAreaStyle
                    ref={textarea => {
                        this.textarea = textarea;
                    }}
                    value={this.generatePageCreator()}
                />
                <ButtonBar>
                    <Button variant="secondary" onClick={this.props.toggleShowGeneratedPageTemplate}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.copyGeneratedPage}>
                        Copy
                    </Button>
                </ButtonBar>
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageTemplateModal);

const TextAreaStyle = styled.textarea`
    width: 100%;
    height: 500px;
`;
