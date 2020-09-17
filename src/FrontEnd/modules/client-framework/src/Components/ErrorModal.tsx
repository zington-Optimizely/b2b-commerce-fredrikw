import { createPageElement } from "@insite/client-framework/Components/ContentItemStore";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import closeErrorModal from "@insite/client-framework/Store/Context/Handlers/CloseErrorModal";
import { loadPageByType } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getPageStateByType } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import Modal from "@insite/mobius/Modal";
import * as React from "react";
import { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    modalIsOpen: !!state.context.isErrorModalOpen,
    errorPage: getPageStateByType(state, "UnhandledErrorModal"),
});

const mapDispatchToProps = {
    loadPageByType,
    closeErrorModal,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const ErrorModal: React.FC<Props> = ({ modalIsOpen, closeErrorModal, errorPage, loadPageByType }) => {
    useEffect(() => {
        if (!errorPage.value && !errorPage.isLoading) {
            loadPageByType("UnhandledErrorModal");
        }
    }, [errorPage.isLoading, errorPage.value, loadPageByType]);

    const modalCloseHandler = () => {
        closeErrorModal();
    };

    if (!errorPage.value) {
        return null;
    }

    return (
        <Modal headline={errorPage.value.fields["modalTitle"]} isOpen={modalIsOpen} handleClose={modalCloseHandler}>
            <div data-test-selector="unhandledErrorModal">
                {createPageElement(errorPage.value.type, errorPage.value)}
            </div>
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);
