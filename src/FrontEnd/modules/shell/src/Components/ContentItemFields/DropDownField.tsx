import logger from "@insite/client-framework/Logger";
import { DropDownFieldDefinition, Option } from "@insite/client-framework/Types/FieldDefinition";
import Select from "@insite/mobius/Select";
import { ContentItemFieldProps } from "@insite/shell/Components/ItemEditor/FieldsEditor";
import StandardControl from "@insite/shell/Components/ItemEditor/StandardControl";
import * as React from "react";

interface State {
    options: Option<string | number>[];
}

type Props = ContentItemFieldProps<string | number, DropDownFieldDefinition<string> | DropDownFieldDefinition<number>>;

export default class DropDownField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            options: [],
        };
    }

    async componentDidMount() {
        const options = await this.getOptions();
        if (options.length === 0) {
            logger.error(`There were no options defined in the properties for the fieldDefinition ${this.props.fieldDefinition.name}`);
        }

        this.setState({
            options,
        });
    }

    async getOptions(): Promise<Option<string | number>[]> {
        if (this.props.fieldDefinition && this.props.fieldDefinition.options) {
            if (typeof this.props.fieldDefinition.options === "function") {
                const options = await this.props.fieldDefinition.options();
                return options;
            }

            return this.props.fieldDefinition.options;
        }

        return [];
    }

    onChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.props.updateField(this.props.fieldDefinition.name, event.currentTarget.value);
    };

    render() {
        const { options } = this.state;
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
