import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React, { FC, useEffect, useState } from "react";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { BillToModel, BaseAddressModel } from "@insite/client-framework/Types/ApiModels";
import loadBillTos from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTos";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import CustomerSelectorToolbar, { CustomerSelectorToolbarStyles } from "@insite/content-library/Components/CustomerSelectorToolbar";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import siteMessage from "@insite/client-framework/SiteMessage";
import CustomerSelector, { CustomerSelectorStyles } from "@insite/content-library/Components/CustomerSelector";
import styled, { css } from "styled-components";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { GetBillTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { getBillTosDataView } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

interface Props {
    currentBillTo?: BillToModel;
    onSelect: (billTo: BillToModel) => void;
    onEdit?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, billTo: BillToModel) => void;
    extendedStyles?: BillToSelectorStyles;
}

export interface BillToSelectorStyles {
    customerSelectorToolbar?: CustomerSelectorToolbarStyles;
    centeringWrapper?: InjectableCss;
    loadingSpinner?: LoadingSpinnerProps;
    addressesLoadFailedText?: TypographyPresentationProps;
    noBillTosText?: TypographyPresentationProps;
    customerSelector?: CustomerSelectorStyles;
}

export const billToSelectorStyles: BillToSelectorStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            height: 300px;
            justify-content: center;
            align-items: center;
        `,
    },
    addressesLoadFailedText: { variant: "h4" },
    noBillTosText: { variant: "h4" },
};

const CenteringWrapper = styled.div<InjectableCss>` ${({ css }) => css} `;

const BillToSelector: FC<Props> = ({
                                       currentBillTo,
                                       onSelect,
                                       extendedStyles,
                                       onEdit,
                                   }) => {

    const [parameter, setParameter] = useState<GetBillTosApiParameter>({ page: 1, pageSize: 8 });

    return <WrappedBillToSelector
                currentBillTo={currentBillTo}
                onSelect={onSelect}
                extendedStyles={extendedStyles}
                parameter={parameter}
                setParameter={setParameter}
                onEdit={onEdit}
            />;
};

interface OwnWrappedProps {
    setParameter: (parameter: GetBillTosApiParameter) => void;
    parameter: GetBillTosApiParameter;
}

const mapStateToProps = (state: ApplicationState, props: OwnWrappedProps) => ({
    billTosDataView: getBillTosDataView(state, props.parameter),
    customerSettings: getSettingsCollection(state).customerSettings,
});

const mapDispatchToProps = {
    loadBillTos,
};

type WrappedProps = Props & OwnWrappedProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const wrappedBillToSelector: FC<WrappedProps> = ({
                                                     currentBillTo,
                                                     billTosDataView,
                                                     onSelect,
                                                     extendedStyles,
                                                     setParameter,
                                                     parameter,
                                                     loadBillTos,
                                                     customerSettings,
                                                     onEdit,
                                                 }) => {
    const [styles] = useState(() => mergeToNew(billToSelectorStyles, extendedStyles));
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    useEffect(
        () => doLoadBillTos(),
        [page, pageSize],
    );

    useEffect(
        () => {
            if (!billTosDataView.value && !billTosDataView.isLoading) {
                loadBillTos(parameter);
            }
        },
    );

    const searchHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => doLoadBillTos();

    const selectCustomerHandler = (customer: BaseAddressModel) => onSelect(customer as BillToModel);

    const editCustomerHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, customer: BaseAddressModel) => {
        if (customerSettings?.allowBillToAddressEdit) {
            onEdit?.(event, customer as BillToModel);
        }
    };

    const changePageHandler = (page: number) => setPage(page);

    const changeResultsPerPageHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(1);
        setPageSize(Number(event.currentTarget.value));
    };

    const doLoadBillTos = () => setParameter({
        page,
        pageSize,
        filter: searchText,
    });

    return <>
        <CustomerSelectorToolbar
            searchText={searchText}
            onSearchTextChanged={(event: React.ChangeEvent<HTMLInputElement>) => setSearchText(event.currentTarget.value)}
            onSearch={searchHandler}
            isSearchDisabled={billTosDataView.isLoading}
            extendedStyles={styles.customerSelectorToolbar}
        />
        {billTosDataView.isLoading || !billTosDataView.value
            ? <CenteringWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.loadingSpinner} />
            </CenteringWrapper>
            : <>
                {billTosDataView.value.length === 0
                    ? <CenteringWrapper {...styles.centeringWrapper}>
                        <Typography {...styles.noBillTosText}>
                            {searchText.length > 0 ? siteMessage("Addresses_NoResultsFound") : siteMessage("Addresses_NoAddressesFound")}
                        </Typography>
                    </CenteringWrapper>
                    : <CustomerSelector
                        customers={billTosDataView.value}
                        pagination={billTosDataView.pagination!}
                        selectedCustomer={currentBillTo}
                        onSelect={selectCustomerHandler}
                        allowEditCustomer={customerSettings !== undefined && customerSettings.allowBillToAddressEdit}
                        onEdit={editCustomerHandler}
                        onChangePage={changePageHandler}
                        onChangeResultsPerPage={changeResultsPerPageHandler}
                        extendedStyles={styles.customerSelector}
                    />
                }
            </>
        }
    </>;
};

const WrappedBillToSelector = connect(mapStateToProps, mapDispatchToProps)(wrappedBillToSelector);

export default BillToSelector;
