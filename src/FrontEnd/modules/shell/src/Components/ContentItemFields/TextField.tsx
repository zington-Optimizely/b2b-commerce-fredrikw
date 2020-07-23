import { TextFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import MobiusTextField from "@insite/mobius/TextField";
import { ContentItemFieldProps } from "@insite/shell/Components/ItemEditor/FieldsEditor";
import StandardControl from "@insite/shell/Components/ItemEditor/StandardControl";
import * as React from "react";

export default class TextField extends React.Component<ContentItemFieldProps<string, TextFieldDefinition>> {

    onChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.updateField(this.props.fieldDefinition.name, event.currentTarget.value);
    };

    render() {
        return <StandardControl fieldDefinition={this.props.fieldDefinition}>
            <MobiusTextField
                id={this.props.fieldDefinition.name}
                type="text"
                value={this.props.fieldValue}
                placeholder={this.props.fieldDefinition.placeholder}
                onChange={this.onChange}
                disabled={this.props.fieldDefinition.isEnabled && !this.props.fieldDefinition.isEnabled(this.props.item)} />
        </StandardControl>;
    }
}
