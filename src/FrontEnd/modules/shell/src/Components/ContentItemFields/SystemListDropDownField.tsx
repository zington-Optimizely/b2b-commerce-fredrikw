import * as React from "react";
import logger from "@insite/client-framework/Logger";
import DropDownField from "@insite/shell/Components/ContentItemFields/DropDownField";
import { SystemListDropDownFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import { ContentItemFieldProps } from "@insite/shell/Components/ItemEditor/FieldsEditor";
import { getAdminSystemListValues, ArchiveFilter } from "@insite/shell/Services/AdminService";

type Props = ContentItemFieldProps<string, SystemListDropDownFieldDefinition>;

export default class SystemListDropDownField extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        if (!this.props.fieldDefinition.systemListName) {
            logger.error(`There was no systemListName defined in the properties for the fieldDefinition ${this.props.fieldDefinition.name}`);
        }
    }

    getOptions = async () => {
        const listValues = await getAdminSystemListValues({
            archiveFilter: ArchiveFilter.Active,
            $filter: `systemList/name eq '${this.props.fieldDefinition.systemListName}'`,
            $select: "name",
        });
        return listValues.map(o => ({
            value: o.name,
            displayName: o.name,
        }));
    };

    render() {
        const dropDownProps = {
            ...this.props,
            fieldDefinition: {
                ...this.props.fieldDefinition,
                editorTemplate: "DropDownField",
                options: this.getOptions,
            },
        } as any;
        return <DropDownField {...dropDownProps} />;
    }
}
