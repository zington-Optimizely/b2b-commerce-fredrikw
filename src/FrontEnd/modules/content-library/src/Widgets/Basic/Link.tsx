import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import MobiusLink from "@insite/mobius/Link";

const enum fields {
    destination = "destination",
    overrideTitle = "overrideTitle",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.destination]: LinkFieldValue;
        [fields.overrideTitle]: string;
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => {
    const link = getLink(state, ownProps.fields.destination);
    return {
        url: link?.url,
        title: link?.title,
    };
};

const mapDispatchToProps = {};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const Link: React.FC<Props> = ({ url, title, fields }) => {
    if (!url) {
        return null;
    }
    return <MobiusLink href={url}>{fields.overrideTitle || title || url}</MobiusLink>;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(Link),
    definition: {
        group: "Basic",
        icon: "Link",
        isSystem: true,
        fieldDefinitions: [
            {
                name: fields.destination,
                editorTemplate: "LinkField",
                defaultValue: { type: "Page", value: "" },
                fieldType: "General",
                isRequired: true,
            },
            {
                name: fields.overrideTitle,
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "Translatable",
            },
        ],
    },
};

export default widgetModule;
