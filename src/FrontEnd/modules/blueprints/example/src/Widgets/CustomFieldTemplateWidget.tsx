/* This example is not currently supported.
 * This illustrates how to create a widget that will make use of custom field definition templates.
 * field definition templates allow you to control how a field will be edited in the shell.
 */

import { WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Typography from "@insite/mobius/Typography";
import React from "react";
import { CustomFieldDefinition } from "../CustomFieldDefinition";

const enum fields {
    textField = "textField",
}

interface Props extends WidgetProps {
    fields: {
        [fields.textField]: string;
    };
}

const CustomFieldTemplateWidget: React.FC<Props> = props => {
    return (
        <Typography variant="h4" as="p">
            {props.fields.textField}
        </Typography>
    );
};

// we need to pass our CustomFieldDefinition so that we can use the CustomTemplate template below
export const definition: WidgetDefinition<CustomFieldDefinition> = {
    group: "Testing Extensions" as any, // Extend the standard groups with `as any`.
    fieldDefinitions: [
        {
            name: fields.textField,
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "General",
        },
        {
            name: "customTemplateField",
            editorTemplate: "CustomTemplate",
            defaultValue: "",
            fieldType: "General",
            // this property is required because the template is CustomTemplate
            customProperty: "CustomValue",
        },
    ],
};

// because we have a CustomFieldDefinition, we need to include that type here
const widgetModule: WidgetModule<CustomFieldDefinition> = {
    component: CustomFieldTemplateWidget,
    definition,
};

export default widgetModule;
