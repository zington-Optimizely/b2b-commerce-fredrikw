import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import React, { FC, useContext } from "react";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { RequestRmaPageContext } from "@insite/content-library/Pages/RequestRmaPage";
import TextArea, { TextAreaProps } from "@insite/mobius/TextArea";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ResolveThunks, connect } from "react-redux";
import setReturnNotes from "@insite/client-framework/Store/Pages/RequestRma/Handlers/SetReturnNotes";

const mapStateToProps = (state: ApplicationState) => ({
    returnNotes: state.pages.requestRma.returnNotes,
});

const mapDispatchToProps = {
    setReturnNotes,
};

export interface RequestRmaNotesStyles {
    wrapper?: InjectableCss;
    notesTextArea?: TextAreaProps;
}

const styles: RequestRmaNotesStyles = {
    wrapper: {
        css: css` padding-bottom: 20px; `,
    },
};

export const notesStyles = styles;

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const RequestRmaNotes: FC<Props> = ({
    returnNotes,
    setReturnNotes,
}) => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    const changeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReturnNotes({ returnNotes: event.currentTarget.value });
    };

    return (
        <StyledWrapper {...styles.wrapper}>
            <TextArea
                label={translate("Return Notes")}
                value={returnNotes}
                rows={5}
                placeholder={translate("Enter your notes here")}
                onChange={changeHandler}
                {...styles.notesTextArea} />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RequestRmaNotes),
    definition: {
        allowedContexts: [RequestRmaPageContext],
        group: "Return Request (RMA)",
        displayName: "Notes",
        fieldDefinitions: [],
    },
};

export default widgetModule;
