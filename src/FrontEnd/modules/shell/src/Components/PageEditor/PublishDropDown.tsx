import React from "react";
import { connect, DispatchProp } from "react-redux";
import styled from "styled-components";
import ShellState from "@insite/shell/Store/ShellState";
import Button, { ButtonIcon } from "@insite/mobius/Button";
import ChevronUp from "@insite/mobius/Icons/ChevronUp";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import ChevronDown from "@insite/mobius/Icons/ChevronDown";
import PublishModal from "@insite/shell/Components/Shell/PublishModal";

const mapStateToProps = ({ shellContext }: ShellState) => ({
    visible: shellContext.publishExpanded,
});

interface OwnProps {}

type PublishDropDownProps = ReturnType<typeof mapStateToProps> & DispatchProp<AnyShellAction> & OwnProps;

class PublishDropDown extends React.Component<PublishDropDownProps> {
    element = React.createRef<HTMLDivElement>();

    hide = () => this.props.dispatch({
        type: "ShellContext/SetPublishExpanded",
    });

    toggle = () => this.props.dispatch({
        type: "ShellContext/SetPublishExpanded",
        publishExpanded: this.props.visible ? undefined : true,
    });

    mouseDown = (event: MouseEvent) => {
        const { current } = this.element;
        if (!current) {
            return;
        }

        if (this.props.visible && !current.contains(event.target as Node)) {
            this.hide();
        }
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.mouseDown);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.mouseDown);
    }

    onPublish = () => {
        this.props.dispatch({
            type: "ShellContext/SetShowModal",
            showModal: "Publish",
        });
    };

    onBulkPublish = () => {
    };

    render() {
        const { visible } = this.props;
        return <>
            <PublishButton
                data-test-selector="headerBar_publish"
                onClick={this.onPublish}
                expanded={visible}
                variant="primary"
            >
                Publish
            </PublishButton>
            <PublishModal />
            <div ref={this.element}>
                {false
                && <PublishDropDownButton
                    expanded={visible}
                    style={{ width: "100%" }}
                    onClick={this.toggle}
                >
                    <ButtonIcon
                        src={visible ? ChevronUp : ChevronDown}
                        size={14}
                    />
                </PublishDropDownButton>
                }
                {!visible ? null
                : <InlinePopUpOuterWrapper>
                    <InlinePopUpInnerWrapper>
                        <div onClick={this.onPublish}>Publish</div>
                        <div onClick={this.onBulkPublish}>Bulk Publish</div>
                    </InlinePopUpInnerWrapper>
                </InlinePopUpOuterWrapper>}
            </div>
        </>;
    }
}

export default connect(mapStateToProps)(PublishDropDown);

const InlinePopUpOuterWrapper = styled.div`
    z-index: ${props => props.theme.zIndex.dynamicDropdown};
    position: relative;
`;

const InlinePopUpInnerWrapper = styled.div`
    position: absolute;
    background: #fff;
    box-shadow: ${props => props.theme.shadows[1]};
    border-radius: 0 0 4px 4px;
    width: 90px;
    right: 0;
    padding: 3px 10px;
    font-size: 14px;
`;

type HasExpanded = { expanded?: boolean };

const PublishButton = styled(Button)<HasExpanded>`
    height: 100%;
    padding: 6px 10px;
`;

const PublishDropDownButton = styled(Button)<HasExpanded>`
    background: #e3971a;
    border: 0;
    border-radius: ${props => props.expanded ? "0 4px 0 0" : "0 4px 4px 0"};
    height: 22px;
    margin: 1px 0 1px 0;
    padding: 0 1px;
`;
