import React, { FC } from "react";
import Zone from "@insite/client-framework/Components/Zone";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { CartPageContext } from "@insite/content-library/Pages/CartPage";

interface OwnProps extends WidgetProps {
}

type Props = OwnProps;

export interface CartHeaderStyles {
    container?: GridContainerProps;
    gridItem1?: GridItemProps;
    gridItem2?: GridItemProps;
}

const styles: CartHeaderStyles = {
    gridItem1: {
        width: [10, 10, 8, 9, 9],
    },
    gridItem2: {
        width: [2, 2, 4, 3, 3],
    },
};

export const cartHeaderStyles = styles;

const CartHeader: FC<Props> = ({ id }) => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.gridItem1}>
                <Zone contentId={id} zoneName="Content0" />
            </GridItem>
            <GridItem {...styles.gridItem2}>
                <Zone contentId={id} zoneName="Content1" />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: CartHeader,
    definition: {
        group: "Cart",
        displayName: "Page Header",
        allowedContexts: [CartPageContext],
        isSystem: true,
    },
};

export default widgetModule;
