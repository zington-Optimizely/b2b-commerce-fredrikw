import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { HasCategoryContext, withCategory } from "@insite/client-framework/Components/CategoryContext";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";

interface Props extends WidgetProps, HasCategoryContext {
}

export interface CategoryImageStyles {
    image?: LazyImageProps;
}

export const categoryImageStyles: CategoryImageStyles = {};

const CategoryImage: React.FC<Props> = ({ category }) => {
    if (!category) {
        return null;
    }

    return <LazyImage src={category.smallImagePath} altText="" {...categoryImageStyles.image} />;
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
