import * as React from "react";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import Modal from "@insite/mobius/Modal";
import { getPageStateByType } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { loadPageByType } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { useEffect, useState } from "react";
import { createPageElement } from "@insite/client-framework/Components/ContentItemStore";
import closeErrorModal from "@insite/client-framework/Store/Context/Handlers/CloseErrorModal";

const mapStateToProps = (state: ApplicationState) => ({
    modalIsOpen: !!state.context.isErrorModalOpen,
    errorPage: getPageStateByType(state, "UnhandledErrorModal"),
});


const mapDispatchToProps = {
    loadPageByType,
    closeErrorModal,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;


const ErrorModal: React.FC<Props> = ({
                                         modalIsOpen,
                                         closeErrorModal,
                                         errorPage,
                                         loadPageByType,
                                     }) => {
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

    return <Modal
        headline={errorPage.value.fields["modalTitle"]}
        isOpen={modalIsOpen}
        handleClose={modalCloseHandler}
    >
        <div data-test-selector="unhandledErrorModal">
            {createPageElement(errorPage.value.type, errorPage.value)}
        </div>
    </Modal>;
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorModal);
