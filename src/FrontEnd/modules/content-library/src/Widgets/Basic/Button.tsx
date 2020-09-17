/* eslint-disable spire/export-styles */
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Button from "@insite/mobius/Button";
import { HasHistory, History, withHistory } from "@insite/mobius/utilities/HistoryContext";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const enum fields {
    variant = "variant",
    label = "label",
    link = "link",
    alignment = "alignment",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.variant]: "primary" | "secondary" | "tertiary";
        [fields.label]: string;
        [fields.link]: LinkFieldValue;
        [fields.alignment]: string;
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => getLink(state, ownProps.fields.link);

const onClick = (history: History, link: string) => {
    if (link) {
        history.push(link);
    }
};

type Props = HasHistory & OwnProps & ReturnType<typeof mapStateToProps>;

const CmsButton: React.FunctionComponent<Props> = ({ fields, history, url }: Props) => {
    const wrapperStyles = {
        css: css`
            width: 100%;
            display: flex;
            justify-content: ${fields.alignment ?? "left"};
        `,
    };

    return (
        <StyledWrapper {...wrapperStyles}>
            <Button variant={fields.variant} onClick={() => onClick(history, url)}>
                {fields.label}
            </Button>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withHistory(CmsButton)),
    definition: {
        group: "Basic",
        icon: "Button",
        fieldDefinitions: [
            {
                name: fields.variant,
                displayName: "Button Variant",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "Primary", value: "primary" },
                    { displayName: "Secondary", value: "secondary" },
                    { displayName: "Tertiary", value: "tertiary" },
                ],
                defaultValue: "primary",
                fieldType: "General",
            },
            {
                name: fields.label,
                displayName: "Button Label",
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
            },
            {
                name: fields.link,
                displayName: "Button Link",
                editorTemplate: "LinkField",
                defaultValue: {
                    value: "",
                    type: "Page",
                },
                fieldType: "General",
            },
            {
                name: fields.alignment,
                displayName: "Button Alignment",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "Left", value: "flex-start" },
                    { displayName: "Center", value: "center" },
                    { displayName: "Right", value: "flex-end" },
                ],
                defaultValue: "primary",
                fieldType: "General",
            },
        ],
    },
};

export default widgetModule;
