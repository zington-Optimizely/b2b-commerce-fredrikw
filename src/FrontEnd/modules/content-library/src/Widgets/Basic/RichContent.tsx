/* eslint-disable spire/export-styles */
import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import parse from "html-react-parser";
import * as React from "react";
import styled from "styled-components";

const enum fields {
    backgroundColor = "backgroundColor",
    padding = "padding",
    content = "content",
}

interface Props extends WidgetProps {
    fields: {
        [fields.backgroundColor]: string;
        [fields.padding]: number;
        [fields.content]: string;
    };
}

const RichContent: React.FunctionComponent<Props> = props => {
    if (!props.fields.content) {
        return null;
    }

    return (
        <ContentWrapper backgroundColor={props.fields.backgroundColor} padding={props.fields.padding}>
            {parse(props.fields.content, parserOptions)}
        </ContentWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: RichContent,
    definition: {
        group: "Basic",
        icon: "Rtf",
        fieldDefinitions: [
            {
                fieldType: "General",
                name: fields.backgroundColor,
                editorTemplate: "ColorPickerField",
                displayName: "Background Color",
                defaultValue: "",
            },
            {
                fieldType: "General",
                name: fields.padding,
                editorTemplate: "IntegerField",
                displayName: "Content Padding",
                defaultValue: 0,
            },
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

const ContentWrapper = styled.div<{ backgroundColor: string; padding: number }>`
    ${({ backgroundColor }) => (backgroundColor ? `background-color: ${backgroundColor};` : null)};
    ${({ padding }) => (padding ? `padding: ${padding}px;` : null)};
    & > *:last-child {
        margin: 0;
    }
`;
