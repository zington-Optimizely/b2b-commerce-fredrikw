import PageProps from "@insite/client-framework/Types/PageProps";
import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { Location } from "@insite/client-framework/Components/SpireRouter";
import { WidgetDefinition, PageDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";

export interface PagesState {
    readonly isLoading: Dictionary<boolean>;
    readonly byId: Dictionary<Readonly<PageProps>>;
    readonly idByPath: SafeDictionary<string>;
    readonly idByType: SafeDictionary<string>;
    readonly widgetIdsByPageId: Dictionary<readonly string[]>;
    readonly widgetsById: Dictionary<Readonly<WidgetProps>>;
    readonly widgetIdsByParentIdAndZone: Dictionary<Dictionary<readonly string[]>>;
    readonly location: Location;
    readonly draggingWidgetId?: string;
    readonly widgetDefinitionsByType?: SafeDictionary<WidgetDefinition>;
    readonly pageDefinitionsByType?: SafeDictionary<PageDefinition>;
}

const frozenEmptyObject = Object.freeze({});

export const nullPage = Object.freeze({
    name: "",
    id: "",
    nodeId: "",
    sortOrder: 0,
    parentId: "",
    type: "NullPage",
    fields: frozenEmptyObject,
    generalFields: frozenEmptyObject,
    translatableFields: frozenEmptyObject,
    contextualFields: frozenEmptyObject,
} as PageProps);
