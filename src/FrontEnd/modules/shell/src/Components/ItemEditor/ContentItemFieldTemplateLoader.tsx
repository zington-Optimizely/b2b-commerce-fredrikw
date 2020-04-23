import * as React from "react";
import { ChildFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import { ContentItemFieldProps } from "@insite/shell/Components/ItemEditor/FieldsEditor";
import MissingField from "@insite/shell/Components/ItemEditor/MissingField";
import { Dictionary } from "@insite/client-framework/Common/Types";

const templatesBeingLoaded: Dictionary<true | undefined> = {};

const loadedFieldTemplates: Dictionary<ContentItemFieldComponent | undefined> = {};

type ContentItemFieldComponent = React.ComponentType<ContentItemFieldProps<any, ChildFieldDefinition>>;

function templateLoaded(templateName: string, templateComponent: ContentItemFieldComponent, onLoad: () => void) {
    loadedFieldTemplates[templateName] = templateComponent;
    delete templatesBeingLoaded[templateName];
    onLoad();
}

export function getEditorTemplate(fieldDefinition: Pick<ChildFieldDefinition, "editorTemplate">, props: ContentItemFieldProps<any, ChildFieldDefinition>, onLoad: () => void) {
    const loadedTemplate = loadedFieldTemplates[fieldDefinition.editorTemplate];
    if (typeof loadedTemplate !== "undefined") {
        return React.createElement(loadedTemplate, props);
    }

    if (!templatesBeingLoaded[fieldDefinition.editorTemplate]) {
        templatesBeingLoaded[fieldDefinition.editorTemplate] = true;

        // TODO ISC-11546 this does not work with dogfood templates.
        import(/* webpackMode: "eager" */`../ContentItemFields/${fieldDefinition.editorTemplate}`)
            .then((template: { default: ContentItemFieldComponent }) => {
                templateLoaded(fieldDefinition.editorTemplate, template.default, onLoad);
            })
            .catch(() => {
                templateLoaded(fieldDefinition.editorTemplate, MissingField, onLoad);
            });
    }

    return <span>Loading...</span>;
}
