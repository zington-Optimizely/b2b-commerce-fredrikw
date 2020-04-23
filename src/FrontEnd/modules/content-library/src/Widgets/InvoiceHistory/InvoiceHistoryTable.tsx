import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadInvoices from "@insite/client-framework/Store/Data/Invoices/Handlers/LoadInvoices";
import updateSearchFields from "@insite/client-framework/Store/Pages/InvoiceHistory/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Link from "@insite/mobius/Link";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { InvoiceHistoryPageContext } from "@insite/content-library/Pages/InvoiceHistoryPage";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import Icon from "@insite/mobius/Icon";
import ChevronDown from "@insite/mobius/Icons/ChevronDown";
import ChevronUp from "@insite/mobius/Icons/ChevronUp";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";
import { InvoicesDataViewContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import { useContext } from "react";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";

const mapStateToProps = (state: ApplicationState) => ({
    getInvoicesParameter: state.pages.invoiceHistory.getInvoicesParameter,
    language: state.context.session.language,
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface InvoiceHistoryTableStyles {
    container?: InjectableCss;
    headerClickables?: ClickableProps;
    headerText?: TypographyProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyProps;
    dataTable?: DataTableProps;
    dataTableHead?: DataTableHeadProps;
    dataTableHeaders?: DataTableHeaderProps;
    dataTableBody?: DataTableBodyProps;
    dataTableRow?: DataTableRowProps;
    dataTableCells?: DataTableCellBaseProps;
    invoiceNumberHeader?: DataTableHeaderProps;
    invoiceDateHeader?: DataTableHeaderProps;
    termsHeader?: DataTableHeaderProps;
    dueDateHeader?: DataTableHeaderProps;
    shipToHeader?: DataTableHeaderProps;
    statusHeader?: DataTableHeaderProps;
    totalHeader?: DataTableHeaderProps;
    currentBalanceHeader?: DataTableHeaderProps;
    invoiceNumberCell?: DataTableCellBaseProps;
    invoiceDateCell?: DataTableCellBaseProps;
    termsCell?: DataTableCellBaseProps;
    dueDateCell?: DataTableCellBaseProps;
    shipToCell?: DataTableCellBaseProps;
    statusCell?: DataTableCellBaseProps;
    totalCell?: DataTableCellBaseProps;
    currentBalanceCell?: DataTableCellBaseProps;
}

const styles: InvoiceHistoryTableStyles = {
    container: {
        css: css` overflow: auto; `,
    },
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css` margin: auto; `,
    },
    noResultsContainer: {
        css: css`
            text-align: center;
            padding: 20px;
        `,
    },
    noResultsText: {
        size: 16,
        weight: 600,
    },
    headerClickables: {
        css: css`
            &:focus {
                outline-style: none;
            }
            width: 100%;
            justify-content: space-between;
            display: block;
        `, // TODO ISC-12604 focus removal is incorrect
    },
    totalHeader: {
        alignX: "right",
    },
    currentBalanceHeader: {
        alignX: "right",
    },
    totalCell: {
        alignX: "right",
    },
    currentBalanceCell: {
        alignX: "right",
    },
};

export const tableStyles = styles;

const InvoiceHistoryTable = (props: Props) => {
    const headerClick = (sortField: string) => {
        const sort = props.getInvoicesParameter.sort === sortField ? `${sortField} DESC` : sortField;
        props.updateSearchFields({ sort });
    };

    // TODO ISC-12604 screenreader content for what the click action does
    const sortingHeaderLabel = (label: string, sortField: string) =>
        <Clickable {...styles.headerClickables} onClick={() => headerClick(sortField)}>
            <Typography {...styles.headerText}>{translate(label)}</Typography>
            {props.getInvoicesParameter.sort === sortField
                ? <Icon src={ChevronUp} size={14}/>
                : props.getInvoicesParameter.sort === `${sortField} DESC`
                    ? <Icon src={ChevronDown} size={14}/> : null}
        </Clickable>;

    const invoicesDataView = useContext(InvoicesDataViewContext);
    if (!invoicesDataView.value) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner}></LoadingSpinner>
            </StyledWrapper>
        );
    }

    if (invoicesDataView.value.length === 0) {
        return (
            <StyledWrapper {...styles.noResultsContainer}>
                <Typography {...styles.noResultsText}>{translate("No invoices found")}</Typography>
            </StyledWrapper>
        );
    }

    const rows = invoicesDataView.value.map((invoice) => {
        return {
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            date: invoice.invoiceDate ? getLocalizedDateTime({
                dateTime: new Date(invoice.invoiceDate),
                language: props.language,
            }) : "",
            terms: invoice.terms,
            dueDate: invoice.dueDate ? getLocalizedDateTime({
                dateTime: new Date(invoice.dueDate),
                language: props.language,
            }) : "",
            shipTo: `${invoice.stCompanyName} ${invoice.btAddress1} ${invoice.btAddress2} ${invoice.shipToCity} ${invoice.shipToState}`,
            status: invoice.status,
            total: invoice.invoiceTotalDisplay,
            currentBalance: invoice.currentBalanceDisplay,
        };
    });

    return (
        <StyledWrapper {...styles.container}>
            <DataTable {...styles.dataTable}>
                <DataTableHead {...styles.dataTableHead}>
                    <DataTableHeader tight {...styles.invoiceNumberHeader} title={translate("Invoice #")}>
                        {sortingHeaderLabel("Invoice #", "invoiceNumber")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.invoiceDateHeader}>
                        {sortingHeaderLabel("Invoice Date", "invoiceDate")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.termsHeader}>
                        {sortingHeaderLabel("Terms", "terms")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.dueDateHeader}>
                        {sortingHeaderLabel("Due Date", "dueDate")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.shipToHeader}>
                        {sortingHeaderLabel("Ship To / Pick Up", "stCompanyName")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.statusHeader}>
                        {sortingHeaderLabel("Status", "status")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.totalHeader}>
                        {sortingHeaderLabel("Invoice Total", "invoiceTotal")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.currentBalanceHeader}>
                        {sortingHeaderLabel("Current Balance", "currentBalance")}
                    </DataTableHeader>
                </DataTableHead>
                <DataTableBody {...styles.dataTableBody}>
                    {rows.map(({ id, invoiceNumber, date, terms, dueDate, shipTo, status, total, currentBalance }) => (
                        <DataTableRow key={id} {...styles.dataTableRow} data-test-selector="invoiceHistory_invoiceLine">
                            <DataTableCell {...styles.invoiceNumberCell}>
                                <Link
                                    href={`/MyAccount/Invoices/Details?invoiceNumber=${invoiceNumber}`}
                                    data-test-selector="invoiceHistory_invoiceLine_number"
                                >
                                    {invoiceNumber}
                                </Link>
                            </DataTableCell>
                            <DataTableCell {...styles.invoiceDateCell} data-test-selector="invoiceHistory_invoiceLine_date">{date}</DataTableCell>
                            <DataTableCell {...styles.termsCell}>{terms}</DataTableCell>
                            <DataTableCell {...styles.dueDateCell}>{dueDate}</DataTableCell>
                            <DataTableCell {...styles.shipToCell}>{shipTo}</DataTableCell>
                            <DataTableCell {...styles.statusCell}>{status}</DataTableCell>
                            <DataTableCell {...styles.totalCell}>{total}</DataTableCell>
                            <DataTableCell {...styles.currentBalanceCell}>{currentBalance}</DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(InvoiceHistoryTable),
    definition: {
        group: "Invoice History",
        displayName: "Search Results Table",
        allowedContexts: [InvoiceHistoryPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
