import { Dictionary } from "@insite/client-framework/Common/Types";
import PageProps from "@insite/client-framework/Types/PageProps";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { Location } from "@insite/client-framework/Components/SpireRouter";

export default interface CurrentPageState {
    readonly selectedProductPath?: string;
    readonly selectedCategoryPath?: string;
    readonly selectedBrandPath?: string;
    readonly draggingWidgetId?: string;
    readonly page: PageProps;
    readonly header: PageProps;
    readonly footer: PageProps;
    readonly widgetIdsByPageId: Dictionary<readonly string[]>;
    readonly widgetsById: Dictionary<Readonly<WidgetProps>>;
    readonly widgetIdsByParentIdAndZone: Dictionary<Dictionary<readonly string[]>>;
    readonly location: Location;
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
