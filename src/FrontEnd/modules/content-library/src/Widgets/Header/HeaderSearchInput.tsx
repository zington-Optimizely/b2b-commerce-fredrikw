import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import SearchInput, { SearchInputStyles } from "@insite/content-library/Widgets/Header/SearchInput";
import React from "react";

export interface HeaderSearchInputStyles {
    searchInputStyles?: SearchInputStyles;
}

export const searchInputStyles: HeaderSearchInputStyles = {};

const styles = searchInputStyles;

const HeaderSearchInput: React.FC<WidgetProps> = ({ id }) => (
    <SearchInput id={id} extendedStyles={styles.searchInputStyles} />
);

const widgetModule: WidgetModule = {
    component: HeaderSearchInput,
    definition: {
        group: "Header",
        displayName: "Search Input",
        allowedContexts: ["Header"],
    },
};

export default widgetModule;
