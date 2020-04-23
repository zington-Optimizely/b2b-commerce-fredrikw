import * as React from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import translate from "@insite/client-framework/Translate";
import { MyListsPageContext } from "@insite/content-library/Pages/MyListsPage";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import MyListsEditListForm from "@insite/content-library/Widgets/MyLists/MyListsEditListForm";
import Hidden from "@insite/mobius/Hidden";
import OverflowMenu from "@insite/mobius/OverflowMenu";
import Clickable from "@insite/mobius/Clickable";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";

interface State {
    createListModalIsOpen: boolean;
    nameError?: string;
}

type Props = WidgetProps;

export interface MyListsCreateListButtonStyles {
    wrapper?: InjectableCss;
    createListButton?: ButtonPresentationProps;
    createListModal?: ModalPresentationProps;
}

const styles: MyListsCreateListButtonStyles = {
    wrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
        `,
    },
    createListButton: {
        color: "secondary",
    },
    createListModal: {
        sizeVariant: "small",
    },
};

export const createListButtonStyles = styles;

class MyListsCreateListButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            createListModalIsOpen: false,
        };
    }

    buttonClickHandler = () => {
        this.setState({ createListModalIsOpen: true });
    };

    modalCloseHandler = () => {
        this.setState({ createListModalIsOpen: false });
    };

    render() {
        return (
            <StyledWrapper {...styles.wrapper}>
                <Hidden above="sm">
                    <OverflowMenu>
                        <Clickable onClick={this.buttonClickHandler}>{translate("Create List")}</Clickable>
                    </OverflowMenu>
                </Hidden>
                <Hidden below="md">
                    <Button {...styles.createListButton} onClick={this.buttonClickHandler} data-test-selector="myListsCreateListButton">
                        {translate("Create List")}
                    </Button>
                </Hidden>
                <Modal
                    headline={translate("Create List")}
                    {...styles.createListModal}
                    isOpen={this.state.createListModalIsOpen}
                    handleClose={this.modalCloseHandler}>
                    <MyListsEditListForm
                        onCancel={this.modalCloseHandler}
                        onSubmit={this.modalCloseHandler}>
                    </MyListsEditListForm>
                </Modal>
            </StyledWrapper>
        );
    }
}

const widgetModule: WidgetModule = {
    component: MyListsCreateListButton,
    definition: {
        group: "My Lists",
        displayName: "Create List Button",
        allowedContexts: [MyListsPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
