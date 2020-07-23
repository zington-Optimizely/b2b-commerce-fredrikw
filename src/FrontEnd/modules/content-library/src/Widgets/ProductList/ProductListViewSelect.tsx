import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import setView from "@insite/client-framework/Store/Pages/ProductList/Handlers/SetView";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Grid from "@insite/mobius/Icons/Grid";
import List from "@insite/mobius/Icons/List";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    productsState: state.pages.productList.productsState,
    view: state.pages.productList.view || getSettingsCollection(state).productSettings.defaultViewType,
});

const mapDispatchToProps = {
    setView,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListViewSelectStyles {
    wrapper?: InjectableCss;
    listViewClickable?: ClickablePresentationProps;
    listViewIcon?: IconPresentationProps;
    gridViewClickable?: ClickablePresentationProps;
    gridViewIcon?: IconPresentationProps;
}

const styles: ProductListViewSelectStyles = {
    wrapper: {
        css: css`
            display: flex;
            padding-top: 5px;
            float: right;
        `,
    },
    listViewClickable: {
        css: css` margin-right: 20px; `,
    },
    listViewIcon: {
        src: List,
        size: 30,
    },
    gridViewIcon: {
        src: Grid,
        size: 30,
    },
};

export const viewSelectStyles = styles;

const ProductListViewSelect: FC<Props> = ({ view, setView, productsState }) => {
    if (!productsState.value) {
        return null;
    }

    const clickListViewHandler = () => {
        setView({ view: "List" });
    };

    const clickGridViewHandler = () => {
        setView({ view: "Grid" });
    };

    return (
        <StyledWrapper {...styles.wrapper}>
            <Clickable data-test-selector="viewSelectList" {...styles.listViewClickable} onClick={clickListViewHandler}>
                <Icon {...styles.listViewIcon} color={view === "List" ? "primary" : undefined}/>
            </Clickable>
            <Clickable data-test-selector="viewSelectGrid" {...styles.gridViewClickable} onClick={clickGridViewHandler}>
                <Icon {...styles.gridViewIcon} color={view === "Grid" ? "primary" : undefined}/>
            </Clickable>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(ProductListViewSelect),
    definition: {
        group: "Product List",
        displayName: "View Select",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
