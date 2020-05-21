import * as React from "react";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { OrderDetailsPageContext } from "@insite/content-library/Pages/OrderDetailsPage";
import { useContext } from "react";
import { OrderStateContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import parse from "html-react-parser";
import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";

export interface OrderDetailsShipmentPackagesStyles {
    dataTable?: DataTableProps;
    dataTableHead?: DataTableHeadProps;
    shipmentDateHeader?: DataTableHeaderProps;
    carrierHeader?: DataTableHeaderProps;
    shipViaHeader?: DataTableHeaderProps;
    trackingNumberHeader?: DataTableHeaderProps;
    dataTableBody?: DataTableBodyProps;
    dataTableRow?: DataTableRowProps;
    shipmentDateCell?: DataTableCellProps;
    carrierCell?: DataTableCellProps;
    shipViaCell?: DataTableCellProps;
    trackingNumberCell?: DataTableCellProps;
}

const styles: OrderDetailsShipmentPackagesStyles = {
};

export const shipmentPackagesStyles = styles;

const OrderDetailsShipmentPackages: React.FC = () => {
    const { value: order } = useContext(OrderStateContext);
    if (!order) {
        return null;
    }

    if (!order.shipmentPackages || order.shipmentPackages.length === 0) {
        return null;
    }

    return (
        <DataTable {...styles.dataTable}>
            <DataTableHead {...styles.dataTableHead}>
                <DataTableHeader {...styles.shipmentDateHeader}>{translate("Ship Date")}</DataTableHeader>
                <DataTableHeader {...styles.carrierHeader}>{translate("Carrier")}</DataTableHeader>
                <DataTableHeader {...styles.shipViaHeader}>{translate("Service")}</DataTableHeader>
                <DataTableHeader {...styles.trackingNumberHeader}>{translate("Tracking #")}</DataTableHeader>
            </DataTableHead>
            <DataTableBody {...styles.dataTableBody}>
                {order.shipmentPackages.map(shipmentPackage => (
                    <DataTableRow {...styles.dataTableRow} key={shipmentPackage.id}>
                        <DataTableCell {...styles.shipmentDateCell}>
                            <LocalizedDateTime dateTime={new Date(shipmentPackage.shipmentDate)} options={{ year: "numeric", month: "numeric", day: "numeric" }} />
                        </DataTableCell>
                        <DataTableCell {...styles.carrierCell}>{shipmentPackage.carrier}</DataTableCell>
                        <DataTableCell {...styles.shipViaCell}>{shipmentPackage.shipVia}</DataTableCell>
                        <DataTableCell {...styles.trackingNumberCell}>{parse(shipmentPackage.trackingUrl, parserOptions)}</DataTableCell>
                    </DataTableRow>))
                }
            </DataTableBody>
        </DataTable>
    );
};

const widgetModule: WidgetModule = {
    component: OrderDetailsShipmentPackages,
    definition: {
        allowedContexts: [OrderDetailsPageContext],
        group: "Order Details",
        fieldDefinitions: [],
    },
};

export default widgetModule;
