import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BrandDetailsPageContext } from "@insite/content-library/Pages/BrandDetailsPage";
import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import parse from "html-react-parser";
import React, { FC, useContext } from "react";
import { css } from "styled-components";
import { BrandStateContext } from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";

interface Props extends WidgetProps {
}

export interface BrandDetailsContentStyles {
    container?: InjectableCss;
}

const styles: BrandDetailsContentStyles = {
    container: {
        css: css` margin: 30px 15px; `,
    },
};

export const contentStyles = styles;

const BrandDetailsContent: FC<Props> = () => {
    const { value: brand } = useContext(BrandStateContext);

    if (!brand || !brand.htmlContent) {
        return null;
    }

    return (
        <StyledWrapper {...styles.container} data-test-selector="brandContent">
            {parse(brand.htmlContent, parserOptions)}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: BrandDetailsContent,
    definition: {
        group: "Brand Details",
        displayName: "Content",
        allowedContexts: [BrandDetailsPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
