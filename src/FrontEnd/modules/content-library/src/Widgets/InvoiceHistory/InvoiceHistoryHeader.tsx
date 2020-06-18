import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { connect, ResolveThunks } from "react-redux";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconProps } from "@insite/mobius/Icon";
import Filter from "@insite/mobius/Icons/Filter";
import Clickable from "@insite/mobius/Clickable";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import { InvoiceHistoryPageContext } from "@insite/content-library/Pages/InvoiceHistoryPage";
import Zone from "@insite/client-framework/Components/Zone";
import { css } from "styled-components";
import { InvoicesDataViewContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import { useContext } from "react";
import toggleFiltersOpen from "@insite/client-framework/Store/Pages/InvoiceHistory/Handlers/ToggleFiltersOpen";

const mapDispatchToProps = {
    toggleFiltersOpen,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface InvoiceHistoryHeaderStyles {
    container?: GridContainerProps;
    heading?: TypographyProps;
    invoiceCountGridItem?: GridItemProps;
    emptyGridItem?: GridItemProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconProps;
}

const styles: InvoiceHistoryHeaderStyles = {
    container: { gap: 8, css: css` padding-bottom: 10px; ` },
    heading: { variant: "h2", as: "h1" },
    invoiceCountGridItem: {
        width: 11,
        style: { marginTop: "8px", fontWeight: 600 },
    },
    toggleFilterGridItem: {
        width: 1,
        style: { marginTop: "8px", justifyContent: "flex-end" },
    },
    toggleFilterIcon: { size: 24 },
};

export const headerStyles = styles;

const InvoiceHistoryHeader = (props: Props) => {
    const invoicesDataView = useContext(InvoicesDataViewContext);
    const invoicesCount = invoicesDataView.value && invoicesDataView.pagination ? invoicesDataView.pagination.totalItemCount : 0;

    return <>
        <Typography {...styles.heading}>{translate("Invoice History")}</Typography>
        <Zone contentId={props.id} zoneName="Content00"/>
        <GridContainer {...styles.container}>
            <GridItem {...styles.invoiceCountGridItem}>
                {invoicesCount} {translate("Invoices")}
            </GridItem>
            <GridItem {...styles.toggleFilterGridItem}>
                <Clickable onClick={props.toggleFiltersOpen} data-test-selector="invoiceHistory_toggleFilter">
                    <Icon src={Filter} {...styles.toggleFilterIcon} />
                </Clickable>
            </GridItem>
        </GridContainer>
    </>;
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(InvoiceHistoryHeader),
    definition: {
        group: "Invoice History",
        displayName: "Page Header",
        allowedContexts: [InvoiceHistoryPageContext],
        isSystem: true,
    },
};

export default widgetModule;
