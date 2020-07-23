import { MultilineTextFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import TextArea from "@insite/mobius/TextArea";
import { ContentItemFieldProps } from "@insite/shell/Components/ItemEditor/FieldsEditor";
import StandardControl from "@insite/shell/Components/ItemEditor/StandardControl";
import * as React from "react";

export default class MultilineTextField extends React.Component<ContentItemFieldProps<string, MultilineTextFieldDefinition>> {

    onChange = (event: React.FormEvent<HTMLTextAreaElement>) => {
        this.props.updateField(this.props.fieldDefinition.name, event.currentTarget.value);
    };

    render() {
        return <StandardControl fieldDefinition={this.props.fieldDefinition}>
        <TextArea
            id={this.props.fieldDefinition.name}
            className="textarea"
            value={this.props.fieldValue}
            placeholder={this.props.fieldDefinition.placeholder}
            disabled={this.props.fieldDefinition.isEnabled && !this.props.fieldDefinition.isEnabled(this.props.item)}
            onChange={this.onChange}/>
        </StandardControl>;
    }
}
