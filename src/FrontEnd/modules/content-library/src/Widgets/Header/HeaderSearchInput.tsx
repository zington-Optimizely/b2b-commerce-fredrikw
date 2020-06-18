import React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import SearchInput, { SearchInputStyles } from "@insite/content-library/Widgets/Header/SearchInput";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";

export interface HeaderSearchInputStyles {
    searchInputStyles?: SearchInputStyles;
}

const styles: HeaderSearchInputStyles = {
};

export const searchInputStyles = styles;

const HeaderSearchInput: React.FC<WidgetProps> = ({ id }) => <SearchInput id={id} extendedStyles={styles.searchInputStyles} />;

const widgetModule: WidgetModule = {
    component: HeaderSearchInput,
    definition: {
        group: "Header",
        displayName: "Search Input",
        allowedContexts: ["Header"],
        isSystem: true,
    },
};

export default widgetModule;
