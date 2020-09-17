import FieldDefinition, { BaseFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";

// We want to define two custom ContentItemField editors
export interface CustomTemplateDefinition extends BaseFieldDefinition<"CustomTemplate"> {
    customProperty: string;
}

export interface CustomBooleanTemplate extends BaseFieldDefinition<"CustomBooleanTemplate", boolean> {
    customProperty2: string;
}

// We need to extend the base FieldDefinition with any custom FieldDefinitions we are going to define
export type CustomFieldDefinition = FieldDefinition | CustomTemplateDefinition | CustomBooleanTemplate;
