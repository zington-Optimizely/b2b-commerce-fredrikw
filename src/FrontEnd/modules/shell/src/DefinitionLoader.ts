import { newGuid, splitCamelCase } from "@insite/client-framework/Common/StringHelpers";
import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import { getThePageDefinitions, getTheWidgetDefinitions } from "@insite/client-framework/Components/ContentItemStore";
import logger from "@insite/client-framework/Logger";
import { ContentItemDefinition, PageDefinition, WidgetDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import FieldDefinition from "@insite/client-framework/Types/FieldDefinition";
import sortBy from "lodash/sortBy";

export type LoadedWidgetDefinition = WidgetDefinition & HasType;
export type LoadedPageDefinition = PageDefinition & HasType;

interface HasType {
    type: string;
}

const systemUris: SafeDictionary<true> = {
    api: true,
    admin: true,
    contentadmin: true,
    ckfinder: true,
    systemresources: true,
    identity: true,
    bundles: true,
    email: true,
    redirectto: true,
    userfiles: true,
    dist: true,
    creators: true,
    importexport: true,
    ".spire": true,
};

let loadedDefinitions = false;
const widgetDefinitionsByType: Dictionary<LoadedWidgetDefinition> = {};
const widgetDefinitions: LoadedWidgetDefinition[] = [];
const pageDefinitionsByType: Dictionary<LoadedPageDefinition> = {};
const pageDefinitions: LoadedPageDefinition[] = [];

export function getWidgetDefinitions(): LoadedWidgetDefinition[] {
    if (!loadedDefinitions) {
        loadDefinitions();
    }

    return widgetDefinitions;
}

export function getWidgetDefinition(type: string): LoadedWidgetDefinition {
    if (!loadedDefinitions) {
        loadDefinitions();
    }

    return widgetDefinitionsByType[type];
}

export function getPageDefinitions(): LoadedPageDefinition[] {
    if (!loadedDefinitions) {
        loadDefinitions();
    }

    return pageDefinitions;
}

export function getPageDefinition(type: string): LoadedPageDefinition {
    if (!loadedDefinitions) {
        loadDefinitions();
    }

    return pageDefinitionsByType[type];
}

function loadDefinitions() {
    const widgets = getTheWidgetDefinitions();

    for (const type in widgets) {
        widgetDefinitionsByType[type] = {
            ...widgets[type],
            type,
        };

        cleanup(widgetDefinitionsByType[type]);

        widgetDefinitions.push(widgetDefinitionsByType[type]);
    }

    const pages = getThePageDefinitions();

    for (const type in pages) {
        pageDefinitionsByType[type] = {
            ...pages[type],
            type,
        };

        cleanupPageDefinition(pageDefinitionsByType[type]);
        cleanup(pageDefinitionsByType[type]);

        pageDefinitions.push(pageDefinitionsByType[type]);
    }

    loadedDefinitions = true;
}

function cleanupField(fieldDefinition: FieldDefinition) {
    if (typeof fieldDefinition.name === "undefined") {
        logger.warn(`A field definition without a name was found. ${JSON.stringify(fieldDefinition)}`);
        fieldDefinition.name = newGuid();
    }

    if (typeof fieldDefinition.displayName === "undefined") {
        fieldDefinition.displayName = splitCamelCase(fieldDefinition.name);
    }
    if (typeof fieldDefinition.tab === "undefined") {
        fieldDefinition.tab = {
            displayName: "Basic",
            sortOrder: 0,
            dataTestSelector: "editPage_basicTab",
        };
    }
    if (typeof fieldDefinition.sortOrder === "undefined") {
        fieldDefinition.sortOrder = 999999;
    }

    const childFieldDefinitions = (fieldDefinition as any)["fieldDefinitions"];
    if (typeof childFieldDefinitions !== "undefined") {
        for (const childFieldDefinition of childFieldDefinitions) {
            cleanupField(childFieldDefinition);
        }
    }
}

function cleanup(definition: ContentItemDefinition & HasType) {
    if (typeof definition.displayName === "undefined") {
        const type = definition.type;
        const displayName = type.lastIndexOf("/") >= 0 ? type.substr(type.lastIndexOf("/") + 1) : type;
        definition.displayName = splitCamelCase(displayName);
    }

    if (!definition.fieldDefinitions) {
        definition.fieldDefinitions = [];
    }

    for (const fieldDefinition of definition.fieldDefinitions) {
        cleanupField(fieldDefinition);
    }

    definition.fieldDefinitions = sortBy(definition.fieldDefinitions, [(o: FieldDefinition) => o.sortOrder]);
}

function cleanupPageDefinition(pageDefinition: LoadedPageDefinition) {
    let { fieldDefinitions } = pageDefinition;
    if (!fieldDefinitions) {
        fieldDefinitions = pageDefinition.fieldDefinitions = [];
    }

    if (pageDefinition.hasEditableTitle) {
        fieldDefinitions.push(
            {
                name: "title",
                displayName: "SEO Title",
                editorTemplate: "TextField",
                defaultValue: "New Page",
                fieldType: "Translatable",
                isRequired: true,
                sortOrder: 0,
            });
    }
    if (pageDefinition.hasEditableUrlSegment) {
        fieldDefinitions.push({
            name: "urlSegment",
            editorTemplate: "TextField",
            defaultValue: "",
            fieldType: "Translatable",
            tooltip: "URL path component identifying this page.",
            isRequired: true,
            sortOrder: 100,
            regularExpression: new RegExp("^[0-9a-zA-Z_\\-]+$"),
            validate: value => (systemUris[value?.toLowerCase()] && "Field has reserved system value") || null,
        });
    }

    fieldDefinitions.push({
        name: "horizontalRule",
        editorTemplate: "HorizontalRule",
        defaultValue: "",
        fieldType: "General",
        sortOrder: 9998,
    });

    fieldDefinitions.push({
        name: "tags",
        editorTemplate: "TagsField",
        defaultValue: [],
        fieldType: "General",
        sortOrder: 9999,
    });

    fieldDefinitions.push({
        name: "hideBreadcrumbs",
        editorTemplate: "CheckboxField",
        displayName: "Hide Breadcrumbs",
        defaultValue: false,
        fieldType: "General",
        sortOrder: 10000,
    });
}
