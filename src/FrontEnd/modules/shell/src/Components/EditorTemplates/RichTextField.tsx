import { RichTextFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import RichTextEditor from "@insite/shell/Components/Elements/RichTextEditor";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml.js";
import "font-awesome/css/font-awesome.css";
import * as React from "react";

type Props = EditorTemplateProps<string, RichTextFieldDefinition>;

export default class RichTextField extends React.Component<Props> {
    onChange = (model: string) => {
        this.props.updateField(this.props.fieldDefinition.name, model);
    };

    render() {
        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition}>
                <RichTextEditor
                    value={this.props.fieldValue}
                    name={this.props.fieldDefinition.name}
                    placeholder={this.props.fieldDefinition.placeholder}
                    extendedConfig={this.props.fieldDefinition.extendedConfig}
                    expandedToolbarButtons={this.props.fieldDefinition.expandedToolbarButtons}
                    collapsedToolbarButtons={this.props.fieldDefinition.collapsedToolbarButtons}
                    onChange={this.onChange}
                />
            </StandardControl>
        );
    }
}
