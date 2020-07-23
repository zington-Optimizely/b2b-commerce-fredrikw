import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import React, { FC } from "react";

interface OwnProps extends WidgetProps {
}

type Props = OwnProps;

export interface ProductListColumnsStyles {
    container?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    rightColumnGridItem?: GridItemProps;
}

const styles: ProductListColumnsStyles = {
    container: {
        gap: 20,
    },
    leftColumnGridItem: {
        width: [12, 12, 3, 3, 3],
    },
    rightColumnGridItem: {
        width: [12, 12, 9, 9, 9],
    },
};

export const columnsStyles = styles;

const ProductListColumns: FC<Props> = ({ id }) => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.leftColumnGridItem}>
                <Zone contentId={id} zoneName="Content00" />
            </GridItem>
            <GridItem  {...styles.rightColumnGridItem}>
                <Zone contentId={id} zoneName="Content01" />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {

    component: ProductListColumns,
    definition: {
        group: "Product List",
        displayName: "Columns",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
