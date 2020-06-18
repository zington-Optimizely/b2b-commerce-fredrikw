import parse from "html-react-parser";
import * as React from "react";
import { HasCategoryContext, withCategory } from "@insite/client-framework/Components/CategoryContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";

interface Props extends WidgetProps, HasCategoryContext {
}

export interface CategoryDetailBannerStyles {
    container?: InjectableCss;
}

const styles: CategoryDetailBannerStyles = {};

export const bannerStyles = styles;

const CategoryDetailBanner: React.FC<Props> = ({
    category,
}: Props) => {
    if (!category) {
        return null;
    }

    return <StyledWrapper {...styles.container}>{parse(category.htmlContent, parserOptions)}</StyledWrapper>;
};

const widgetModule: WidgetModule = {
    component: withCategory(CategoryDetailBanner),
    definition: {
        group: "Categories",
        icon: "Banner",
        isSystem: true,
    },
};

export default widgetModule;
