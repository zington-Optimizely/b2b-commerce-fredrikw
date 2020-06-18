import * as React from "react";
import { css } from "styled-components";
import { connect, ResolveThunks } from "react-redux";
import loadAccountsReceivable from "@insite/client-framework/Store/Pages/InvoiceHistory/Handlers/LoadAccountsReceivable";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import SmallHeadingAndText from "@insite/content-library/Components/SmallHeadingAndText";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { InvoiceHistoryPageContext } from "@insite/content-library/Pages/InvoiceHistoryPage";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

const mapStateToProps = (state: ApplicationState) => ({
    accountsReceivable: getCurrentBillToState(state).value?.accountsReceivable,
    displayAccountsReceivableBalances: getSettingsCollection(state).customerSettings.displayAccountsReceivableBalances,
});

const mapDispatchToProps = {
    loadAccountsReceivable,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface InvoiceHistoryBucketsStyles {
    container?: GridContainerProps;
    item?: GridItemProps;
}

const styles: InvoiceHistoryBucketsStyles = {
    container: {
        gap: 0,
        css: css`
            ${({ theme }: {theme: BaseTheme}) =>
                breakpointMediaQueries(theme, [
                    css` overflow: auto; `,
                    css` overflow: auto; `,
                    null,
                    null,
                    null])
            }
        `,
    },
    item: {
        width: 12,
        style: {
            paddingBottom: "20px",
            minWidth: "600px",
        },
    },
};

export const bucketsStyles = styles;

class InvoiceHistoryBuckets extends React.Component<Props> {
    componentDidMount() {
        if (!this.props.accountsReceivable && this.props.displayAccountsReceivableBalances) {
            this.props.loadAccountsReceivable();
        }
    }

    render() {
        const { accountsReceivable, displayAccountsReceivableBalances } = this.props;
        if (!accountsReceivable || !displayAccountsReceivableBalances) {
            return null;
        }

        return <GridContainer {...styles.container} data-test-selector="invoiceHistory_invoiceBalance">
            <GridItem {...styles.item}>
                {accountsReceivable.agingBuckets!.map((agingBucket, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <SmallHeadingAndText heading={agingBucket.label} text={agingBucket.amountDisplay} key={index} />
                ))}
                <SmallHeadingAndText
                    heading={accountsReceivable.agingBucketTotal!.label}
                    text={accountsReceivable.agingBucketTotal!.amountDisplay} />
            </GridItem>
        </GridContainer>;
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(InvoiceHistoryBuckets),
    definition: {
        group: "Invoice History",
        displayName: "Aging Buckets",
        allowedContexts: [InvoiceHistoryPageContext],
        isSystem: true,
    },
};

export default widgetModule;
