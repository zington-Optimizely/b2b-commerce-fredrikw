import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import parse from "html-react-parser";
import * as React from "react";
import styled from "styled-components";
import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";

const enum fields {
    content = "content",
}

interface Props extends WidgetProps {
    fields: {
        [fields.content]: string;
    };
}

const RichContent: React.FunctionComponent<Props> = (props) => {
    if (!props.fields.content) {
        return null;
    }
    return <>{parse(props.fields.content, parserOptions)}</>;
};

const widgetModule: WidgetModule = {
    component: RichContent,
    definition: {
        group: "Basic",
        icon: "Rtf",
        isSystem: true,
        fieldDefinitions: [
            {
                name: fields.content,
                displayName: "Content",
                editorTemplate: "RichTextField",
                defaultValue: "",
                fieldType: "Contextual",
            },
        ],
    },
};

export default widgetModule;

const Style = styled.div`
    padding: 15px;
`;
