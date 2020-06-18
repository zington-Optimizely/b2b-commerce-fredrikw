import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { connect, ResolveThunks } from "react-redux";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { css, ThemeProps } from "styled-components";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { SavedPaymentsPageContext } from "@insite/content-library/Pages/SavedPaymentsPage";
import updateEditModal from "@insite/client-framework/Store/Pages/SavedPayments/Handlers/UpdateEditModal";
import Hidden from "@insite/mobius/Hidden";
import OverflowMenu from "@insite/mobius/OverflowMenu";
import Clickable from "@insite/mobius/Clickable";

const mapDispatchToProps = {
    updateEditModal,
};

type Props = WidgetProps & ThemeProps<BaseTheme> & ResolveThunks<typeof mapDispatchToProps>;

export interface SavedPaymentsAddCardButtonStyles {
    wrapper?: InjectableCss;
    addCardButton?: ButtonPresentationProps;
}

const styles: SavedPaymentsAddCardButtonStyles = {
    wrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
        `,
    },
    addCardButton: { variant: "tertiary" },
};

export const addCardButtonStyles = styles;

const SavedPaymentsAddCardButton: React.FC<Props> = ({
                                                         updateEditModal,
                                                     }) => {
    const addCardClickHandler = () => {
        updateEditModal({ modalIsOpen: true });
    };

    return <StyledWrapper {...styles.wrapper}>
        <Hidden above="sm">
            <OverflowMenu position="end">
                <Clickable onClick={addCardClickHandler}>{translate("Add a Card")}</Clickable>
            </OverflowMenu>
        </Hidden>
        <Hidden below="md">
            <Button {...styles.addCardButton} onClick={addCardClickHandler} data-test-selector="addCardBtn">{translate("Add a Card")}</Button>
        </Hidden>
    </StyledWrapper>;
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(SavedPaymentsAddCardButton),
    definition: {
        displayName: "Add Card Button",
        group: "Saved Payments",
        allowedContexts: [SavedPaymentsPageContext],
        isSystem: true,
    },
};

export default widgetModule;
