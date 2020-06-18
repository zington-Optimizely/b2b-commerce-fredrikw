import React, { FC } from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import Accordion, { AccordionPresentationProps } from "@insite/mobius/Accordion";
import { css } from "styled-components";
import Zone from "@insite/client-framework/Components/Zone";

interface OwnProps extends WidgetProps {
}

type Props = OwnProps;

export interface ProductListFiltersAccordionStyles {
    accordion?: AccordionPresentationProps;
}

const styles: ProductListFiltersAccordionStyles = {
    accordion: { css: css` padding-top: 20px; ` },
};

export const filtersAccordionStyles = styles;

const ProductListFiltersAccordion: FC<Props> = ({ id }) => {
    return (
        <Accordion headingLevel={2} {...styles.accordion}>
            <Zone contentId={id} zoneName="Content"/>
        </Accordion>
    );
};

const widgetModule: WidgetModule = {
    component: ProductListFiltersAccordion,
    definition: {
        group: "Product List",
        displayName: "Filters Accordion",
        allowedContexts: [ProductListPageContext],
        isSystem: true,
    },
};

export default widgetModule;
