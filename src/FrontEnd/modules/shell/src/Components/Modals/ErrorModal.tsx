import * as React from "react";
import styled from "styled-components";
import Modal from "@insite/mobius/Modal";
import { connect, DispatchProp } from "react-redux";
import ShellState from "@insite/shell/Store/ShellState";
import { AnyShellAction } from "@insite/shell/Store/Reducers";

const mapStateToProps = ({ errorModal: { isOpen, message, error, onCloseAction } }: ShellState) => ({
    isOpen,
    message,
    error,
    redirectToAdmin: onCloseAction === "RedirectToAdmin",
});

type Props = ReturnType<typeof mapStateToProps> & DispatchProp<AnyShellAction>;

const ErrorModal: React.FC<Props> = ({ dispatch, isOpen, message, error, redirectToAdmin }) => {
    const close = () => {
        dispatch({
            type: "ErrorModal/HideModal",
        });

        if (redirectToAdmin) {
            window.location.href = "/admin/";
        }
    };

    return <Modal
        isOpen={!!isOpen}
        headline={redirectToAdmin ? "" : "Unhandled Error"}
        isCloseable
        handleClose={close}
        closeOnEsc>
            <p data-test-selector="errorModal_message">{message || "Please try again and contact support if you continue to have issues."}</p>
            {!IS_PRODUCTION && <JsonText>{JSON.stringify(error, undefined, 2)}</JsonText>}
        </Modal>;
};

const JsonText = styled.pre`
    white-space: pre-wrap;
`;

export default connect(mapStateToProps)(ErrorModal);
