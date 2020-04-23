import * as React from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { InvoiceDetailsPageContext } from "@insite/content-library/Pages/InvoiceDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import InvoiceDetailsShippingAddress from "@insite/content-library/Widgets/InvoiceDetails/InvoiceDetailsShippingAddress";
import InvoiceDetailsBillingAddress from "@insite/content-library/Widgets/InvoiceDetails/InvoiceDetailsBillingAddress";
import { InvoiceDetailsBillingAddressStyles } from "./InvoiceDetailsBillingAddress";
import { InvoiceDetailsShippingAddressStyles } from "./InvoiceDetailsShippingAddress";
import translate from "@insite/client-framework/Translate";
import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { InvoiceStateContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import { FC, useContext } from "react";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    language: state.context.session.language,
});

type Props = ReturnType<typeof mapStateToProps>;

export interface InvoiceDetailsInformationStyles {
    invoiceInformationGridContainer?: GridContainerProps;
    headingAndTextStyles?: SmallHeadingAndTextStyles;
    informationGridItem?: GridItemProps;
    invoiceInformationGridItems?: GridItemProps;
    informationGridContainer?: GridContainerProps;
    statusGridItem?: GridItemProps;
    invoiceDateGridItem?: GridItemProps;
    termsGridItem?: GridItemProps;
    poNumberGridItem?: GridItemProps;
    salespersonGridItem?: GridItemProps;
    dueDateGridItem?: GridItemProps;
    billingAddressGridItem?: GridItemProps;
    shippingAddressGridItem?: GridItemProps;
    invoiceNotesGridItem?: GridItemProps;
    billingAddressStyle?: InvoiceDetailsBillingAddressStyles;
    shippingAddressStyle?: InvoiceDetailsShippingAddressStyles;
}

const styles: InvoiceDetailsInformationStyles = {
    invoiceInformationGridContainer: {
        css: css` padding: 5px; `,
    },
    headingAndTextStyles: {
        heading: {
            variant: "h6",
            as: "h2",
            css: css`
                @media print { font-size: 12px; }
                margin-bottom: 5px;
            `,
        },
    },
    informationGridItem: {
        width: 12,
    },
    invoiceInformationGridItems: {
        css: css` @media print { padding: 5px !important; } `,
    },
    statusGridItem: {
        width: [6, 6, 6, 3, 3],
    },
    invoiceDateGridItem: {
        width: [6, 6, 6, 3, 3],
    },
    termsGridItem: {
        width: [6, 6, 6, 3, 3],
    },
    poNumberGridItem: {
        width: [6, 6, 6, 3, 3],
    },
    salespersonGridItem: {
        width: [6, 6, 6, 3, 3],
    },
    dueDateGridItem: {
        width: [6, 6, 6, 3, 3],
    },
    billingAddressGridItem: {
        width: 6,
    },
    shippingAddressGridItem: {
        width: 6,
    },
    invoiceNotesGridItem: {
        width: 12,
    },
};

export const informationStyles = styles;
const InvoiceDetailsInformation: FC<Props> = ({ language }: Props) => {
    const { value: invoice } = useContext(InvoiceStateContext);
    if (!invoice) {
        return null;
    }

    return (
        <GridContainer {...styles.invoiceInformationGridContainer} data-test-selector="invoiceDetail_information">
            <GridItem {...styles.informationGridItem}>
                <GridContainer {...styles.informationGridContainer}>
                    <GridItem {...mergeToNew(styles.invoiceInformationGridItems, styles.statusGridItem)}>
                        <SmallHeadingAndText extendedStyles={styles.headingAndTextStyles} heading={translate("Status")} text={invoice.status} />
                    </GridItem>
                    <GridItem {...mergeToNew(styles.invoiceInformationGridItems, styles.invoiceDateGridItem)}>
                        <SmallHeadingAndText
                            extendedStyles={styles.headingAndTextStyles}
                            heading={translate("Invoice Date")}
                            text={getLocalizedDateTime({
                                dateTime: new Date(invoice.invoiceDate),
                                language,
                            })} />
                    </GridItem>
                    <GridItem {...mergeToNew(styles.invoiceInformationGridItems, styles.salespersonGridItem)}>
                        <SmallHeadingAndText extendedStyles={styles.headingAndTextStyles} heading={translate("Salesperson")} text={invoice.salesperson} />
                    </GridItem>
                    <GridItem {...mergeToNew(styles.invoiceInformationGridItems, styles.termsGridItem)}>
                        <SmallHeadingAndText extendedStyles={styles.headingAndTextStyles} heading={translate("Terms")} text={invoice.terms} />
                    </GridItem>
                    <GridItem {...mergeToNew(styles.invoiceInformationGridItems, styles.poNumberGridItem)}>
                        <SmallHeadingAndText extendedStyles={styles.headingAndTextStyles} heading={translate("PO Number")} text={invoice.customerPO} />
                    </GridItem>
                    <GridItem {...mergeToNew(styles.invoiceInformationGridItems, styles.dueDateGridItem)}>
                        <SmallHeadingAndText
                            extendedStyles={styles.headingAndTextStyles}
                            heading={translate("Due Date")}
                            text={getLocalizedDateTime({
                                dateTime: new Date(invoice.dueDate),
                                language,
                            })} />
                    </GridItem>
                </GridContainer>
            </GridItem>
            <GridItem {...mergeToNew(styles.invoiceInformationGridItems, styles.billingAddressGridItem)}>
                <InvoiceDetailsBillingAddress invoice={invoice} extendedStyles={styles.billingAddressStyle} />
            </GridItem>
            <GridItem {...mergeToNew(styles.invoiceInformationGridItems, styles.shippingAddressGridItem)}>
                <InvoiceDetailsShippingAddress invoice={invoice} extendedStyles={styles.shippingAddressStyle} />
            </GridItem>
            {invoice.notes
                && <GridItem {...mergeToNew(styles.invoiceInformationGridItems, styles.invoiceNotesGridItem)}>
                    <SmallHeadingAndText extendedStyles={styles.headingAndTextStyles} heading={translate("Invoice Notes")} text={invoice.notes} />
                </GridItem>
            }
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(InvoiceDetailsInformation),
    definition: {
        group: "Invoice History",
        displayName: "Information",
        allowedContexts: [InvoiceDetailsPageContext],
        fieldDefinitions: [],
    },
};

export default widgetModule;
