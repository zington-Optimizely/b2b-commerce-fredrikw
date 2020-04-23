import * as React from "react";
import { ChildFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import { ContentItemFieldProps } from "@insite/shell/Components/ItemEditor/FieldsEditor";

const MissingField: React.FC<ContentItemFieldProps<string, ChildFieldDefinition>> = ({ fieldDefinition: { editorTemplate, name } }) =>
    <span>There was no component '${editorTemplate}' found for the fieldDefinition '${name}'</span>;

export default MissingField;
