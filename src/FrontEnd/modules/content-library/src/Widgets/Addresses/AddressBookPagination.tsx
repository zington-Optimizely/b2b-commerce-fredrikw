import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import updateSearchFields from "@insite/client-framework/Store/Pages/Addresses/Handlers/UpdateSearchFields";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { connect, ResolveThunks } from "react-redux";
import { getShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";

interface OwnProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    shipTosDataView: getShipTosDataView(state, state.pages.addresses.getShipTosParameter),
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface AddressBookPaginationStyles {
    pagination?: PaginationPresentationProps;
}

const styles: AddressBookPaginationStyles = {};

export const addressBookPaginationStyles = styles;

const AddressBookPagination: React.FunctionComponent<Props> = ({
                                                                   shipTosDataView,
                                                                   updateSearchFields,
                                                               }: Props) => {
    if (!shipTosDataView.value || !shipTosDataView.pagination) {
        return null;
    }

    const { totalItemCount, page, pageSize, pageSizeOptions } = shipTosDataView.pagination;
    if (totalItemCount === 0) {
        return null;
    }

    const changePage = (newPageIndex: number) => {
        updateSearchFields({
            page: newPageIndex,
        });
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        updateSearchFields({
            page: 1,
            pageSize: newPageSize,
        });
    };

    return (
        <Pagination
            {...styles.pagination}
            resultsCount={totalItemCount}
            currentPage={page}
            resultsPerPage={pageSize}
            resultsPerPageOptions={pageSizeOptions}
            onChangePage={changePage}
            onChangeResultsPerPage={changeResultsPerPage}/>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AddressBookPagination),
    definition: {
        group: "Addresses",
        icon: "LinkList",
        isSystem: true,
    },
};

export default widgetModule;
