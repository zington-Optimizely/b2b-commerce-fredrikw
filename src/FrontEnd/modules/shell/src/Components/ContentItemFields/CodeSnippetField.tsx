import { CodeSnippetFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import RichTextEditor from "@insite/shell/Components/Elements/RichTextEditor";
import { ContentItemFieldProps } from "@insite/shell/Components/ItemEditor/ItemEditor";
import StandardControl from "@insite/shell/Components/ItemEditor/StandardControl";
import * as React from "react";

type Props = ContentItemFieldProps<string, CodeSnippetFieldDefinition>;

export default class CodeSnippetField extends React.Component<Props> {

    onChange = (model: string) => {
        this.props.updateField(this.props.fieldDefinition.name, model);
    };

    render() {
        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition}>
                <RichTextEditor
                    value={this.props.fieldValue}
                    placeholder={this.props.fieldDefinition.placeholder}
                    extendedConfig={{
                        paragraphMultipleStyles: false,
                        pastePlain: true,
                        codeViewKeepActiveButtons: [`popin${this.props.fieldDefinition.name}`, `popout${this.props.fieldDefinition.name}`, "html"],
                        codeMirrorOptions: {
                            lineNumbers: false,
                        },
                        htmlRemoveTags: [],
                    }}
                    collapsedToolbarButtons={{
                        moreText: {},
                    }}
                    expandedToolbarButtons={{
                        moreParagraph: {},
                        moreText: {},
                        moreMisc: {},
                        code: {},
                        unredo: {},
                    }}
                    onChange={this.onChange}
                    isCodeViewMode={true}
                />
            </StandardControl>
        );
    }
}
