import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { HasCategoryContext, withCategory } from "@insite/client-framework/Components/CategoryContext";

interface Props extends WidgetProps, HasCategoryContext {
}

const CategoryImage: React.FC<Props> = ({ category }) => {
    if (!category) {
        return null;
    }

    return <img src={category.smallImagePath} alt="" />;
};

const widgetModule: WidgetModule = {
    component: withCategory(CategoryImage),
    definition: {
        group: "Categories",
        icon: "Image",
        fieldDefinitions: [],
    },
};

export default widgetModule;
