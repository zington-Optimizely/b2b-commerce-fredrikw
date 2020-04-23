import * as React from "react";
import { DropDownFieldDefinition, Option } from "@insite/client-framework/Types/FieldDefinition";
import logger from "@insite/client-framework/Logger";
import StandardControl from "@insite/shell/Components/ItemEditor/StandardControl";
import { ContentItemFieldProps } from "@insite/shell/Components/ItemEditor/FieldsEditor";
import Select from "@insite/mobius/Select";

export default class DropDownField
    extends React.Component<ContentItemFieldProps<string | number, DropDownFieldDefinition<string> | DropDownFieldDefinition<number>>> {

    constructor(props: ContentItemFieldProps<string | number, DropDownFieldDefinition<string> | DropDownFieldDefinition<number>>) {
        super(props);

        if (this.getOptions().length === 0) {
            logger.error(`There were no options defined in the properties for the fieldDefinition ${props.fieldDefinition.name}`);
        }
    }

    getOptions(): Option<string | number>[] {
        if (this.props.fieldDefinition && this.props.fieldDefinition.options) {
            return this.props.fieldDefinition.options;
        }

        return [];
    }

    onChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.props.updateField(this.props.fieldDefinition.name, event.currentTarget.value);
    };

    render() {
        const options = this.getOptions();
        if (options.length === 0) {
            return null;
        }

        return <StandardControl fieldDefinition={this.props.fieldDefinition}>
                <Select
                    uid={this.props.fieldDefinition.name}
                    value={this.props.fieldValue}
                    onChange={this.onChange}
                    disabled={this.props.fieldDefinition.isEnabled && !this.props.fieldDefinition.isEnabled(this.props.item)}
                >
                    {!this.props.fieldDefinition.hideEmptyOption
                        && <option value="">Select Value</option>
                    }
                    {options.map((option) =>
                        <option key={option.value} value={option.value}>{option.displayName ?? option.value}</option>,
                    )}
                </Select>
        </StandardControl>;
    }
}
