import React, { FC } from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Zone from "@insite/client-framework/Components/Zone";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";

interface OwnProps extends WidgetProps {
}

type Props = OwnProps;

export interface ProductListControlsContainerStyles {
    container?: GridContainerProps;
    countGridItem?: GridItemProps;
    sortGridItem?: GridItemProps;
    viewSelectGridItem?: GridItemProps;
}

const styles: ProductListControlsContainerStyles = {
    container: {
        gap: 0,
    },
    countGridItem: {
        width: [12, 12, 4, 6, 6],
    },
    sortGridItem: {
        width: [12, 12, 4, 4, 4],
    },
    viewSelectGridItem: {
        width: [0, 0, 4, 2, 2],
        css: css`
            ${({ theme }: {theme: BaseTheme}) =>
                breakpointMediaQueries(theme, [
                    css` display: none; `,
                    css` display: none; `,
                    null,
                    null,
                    null])
            }
        `,
    },
};

export const controlsContainerStyles = styles;

const ProductListControlsContainer: FC<Props> = ({ id }) => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.countGridItem}>
                <Zone contentId={id} zoneName="Content00" />
            </GridItem>
            <GridItem {...styles.sortGridItem}>
                <Zone contentId={id} zoneName="Content01" />
            </GridItem>
            <GridItem {...styles.viewSelectGridItem}>
                <Zone contentId={id} zoneName="Content02" />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {

    component: ProductListControlsContainer,
    definition: {
        group: "Product List",
        displayName: "List Controls Container",
        allowedContexts: [ProductListPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
