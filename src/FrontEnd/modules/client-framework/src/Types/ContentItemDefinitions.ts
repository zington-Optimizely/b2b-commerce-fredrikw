import FieldDefinition from "@insite/client-framework/Types/FieldDefinition";
import { WidgetGroup } from "@insite/client-framework/Types/WidgetGroups";

export interface WidgetDefinition<T = FieldDefinition> extends ContentItemDefinition<T> {
    allowedContexts?: string[];
    group: WidgetGroup;
    icon?: string;
}

export interface ContentItemDefinition<T = FieldDefinition> {
    displayName?: string;
    fieldDefinitions: T[];
}

export interface PageDefinition<T = FieldDefinition> extends ContentItemDefinition<T> {
    hasEditableUrlSegment: boolean;
    hasEditableTitle: boolean;
    supportsProductSelection?: true;
    supportsCategorySelection?: true;
    supportsBrandSelection?: true;
    isDeletable?: true;
}
