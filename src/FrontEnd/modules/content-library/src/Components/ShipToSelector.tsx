import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React, { FC, useEffect, useState } from "react";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { BaseAddressModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";
import loadShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTos";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect, ResolveThunks } from "react-redux";
import CustomerSelectorToolbar, { CustomerSelectorToolbarStyles } from "@insite/content-library/Components/CustomerSelectorToolbar";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import siteMessage from "@insite/client-framework/SiteMessage";
import CustomerSelector, { CustomerSelectorStyles } from "@insite/content-library/Components/CustomerSelector";
import styled, { css } from "styled-components";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

import { getShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";

interface Props {
    currentShipTo?: ShipToModel;
    currentBillToId?: string;
    allowSelectBillTo?: boolean;
    onSelect: (shipTo: ShipToModel) => void;
    onEdit?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, customer: BaseAddressModel) => void;
    onCreateNewAddressClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    extendedStyles?: ShipToSelectorStyles;
}

export interface ShipToSelectorStyles {
    customerSelectorToolbar?: CustomerSelectorToolbarStyles;
    centeringWrapper?: InjectableCss;
    loadingSpinner?: LoadingSpinnerProps;
    addressesLoadFailedText?: TypographyPresentationProps;
    noAddressesText?: TypographyPresentationProps;
    customerSelector?: CustomerSelectorStyles;
}

export const shipToSelectorStyles: ShipToSelectorStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            height: 300px;
            justify-content: center;
            align-items: center;
        `,
    },
    addressesLoadFailedText: { variant: "h4" },
    noAddressesText: { variant: "h4" },
};

const CenteringWrapper = styled.div<InjectableCss>` ${({ css }) => css} `;

const ShipToSelector: FC<Props> = ({
                                       currentShipTo,
                                       currentBillToId,
                                       onCreateNewAddressClick,
                                       onEdit,
                                       extendedStyles,
                                       onSelect,
                                       allowSelectBillTo,
                                   }) => {
    const [parameter, setParameter] = useState<GetShipTosApiParameter>({ page: 1, pageSize: 8 });

    return <WrappedShipToSelector
        currentShipTo={currentShipTo}
        currentBillToId={currentBillToId}
        onCreateNewAddressClick={onCreateNewAddressClick}
        onEdit={onEdit}
        extendedStyles={extendedStyles}
        onSelect={onSelect}
        allowSelectBillTo={allowSelectBillTo}
        parameter={parameter}
        setParameter={setParameter}
    />;
};

interface OwnWrappedProps {
    setParameter: (parameter: GetShipTosApiParameter) => void;
    parameter: GetShipTosApiParameter;
}

const mapStateToProps = (state: ApplicationState, props: OwnWrappedProps) => ({
    shipTosDataView: getShipTosDataView(state, props.parameter),
    customerSettings: getSettingsCollection(state).customerSettings,
});

const mapDispatchToProps = {
    loadShipTos,
};

type WrappedProps = Props & OwnWrappedProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const wrappedShipToSelector: FC<WrappedProps> = ({
                                                     currentShipTo,
                                                     currentBillToId,
                                                     shipTosDataView,
                                                     customerSettings,
                                                     loadShipTos,
                                                     onCreateNewAddressClick,
                                                     onEdit,
                                                     extendedStyles,
                                                     onSelect,
                                                     allowSelectBillTo,
                                                     parameter,
                                                     setParameter,
                                                 }) => {

    const [styles] = useState(() => mergeToNew(shipToSelectorStyles, extendedStyles));
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    React.useEffect(
        () => doLoadShipTos(),
        [currentBillToId, page, pageSize],
    );

    useEffect(
        () => {
            if (!shipTosDataView.value && !shipTosDataView.isLoading) {
                loadShipTos(parameter);
            }
        },
    );

    const searchHandler = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => doLoadShipTos();

    const selectCustomerHandler = (customer: BaseAddressModel) => onSelect(customer as ShipToModel);

    const editCustomerHandler = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, customer: BaseAddressModel) => {
        if (customerSettings?.allowShipToAddressEdit) {
            onEdit?.(event, customer as ShipToModel);
        }
    };

    const changePageHandler = (page: number) => setPage(page);

    const changeResultsPerPageHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(1);
        setPageSize(Number(event.currentTarget.value));
    };

    const doLoadShipTos = () => {
        const apiParameter: GetShipTosApiParameter = {
            billToId: currentBillToId,
            page,
            pageSize,
            filter: searchText,
            expand: ["validation"],
            exclude: ["showAll", "billTo", "oneTime", "createNew"],
        };
        if (allowSelectBillTo) {
            apiParameter.exclude = apiParameter.exclude!.filter(value => value !== "billTo");
        }
        setParameter(apiParameter);
    };

    return (
        <>
            <CustomerSelectorToolbar
                searchText={searchText}
                onSearchTextChanged={(event: React.ChangeEvent<HTMLInputElement>) => setSearchText(event.currentTarget.value)}
                onSearch={searchHandler}
                allowCreateAddress={customerSettings !== undefined && customerSettings.allowCreateNewShipToAddress}
                onCreateNewAddressClick={onCreateNewAddressClick}
                isSearchDisabled={shipTosDataView.isLoading}
                extendedStyles={styles.customerSelectorToolbar}
            />
            {shipTosDataView.isLoading || !shipTosDataView.value
                ? <CenteringWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.loadingSpinner} />
                </CenteringWrapper>
                : <>
                    {shipTosDataView.value.length === 0
                        ? <CenteringWrapper {...styles.centeringWrapper}>
                            <Typography {...styles.noAddressesText}>
                                {searchText.length > 0 ? siteMessage("Addresses_NoResultsFound") : siteMessage("Addresses_NoAddressesFound")}
                            </Typography>
                        </CenteringWrapper>
                        : <CustomerSelector
                            customers={shipTosDataView.value}
                            pagination={shipTosDataView.pagination!}
                            selectedCustomer={currentShipTo}
                            onSelect={selectCustomerHandler}
                            allowEditCustomer={customerSettings !== undefined && customerSettings.allowShipToAddressEdit}
                            onEdit={editCustomerHandler}
                            onChangePage={changePageHandler}
                            onChangeResultsPerPage={changeResultsPerPageHandler}
                            extendedStyles={styles.customerSelector}
                        />
                    }
                </>
            }
        </>
    );
};

const WrappedShipToSelector = connect(mapStateToProps, mapDispatchToProps)(wrappedShipToSelector);

export default ShipToSelector;
