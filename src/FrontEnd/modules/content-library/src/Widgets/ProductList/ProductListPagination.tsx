import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    productsState: state.pages.productList.productsState,
});

const mapDispatchToProps = {
    addProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListPaginationStyles {
    pagination?: PaginationPresentationProps;
}

const styles: ProductListPaginationStyles = {};

export const paginationStyles = styles;

const ProductListPagination: FC<Props> = ({ addProductFilters, productsState }) => {
    if (!productsState.value) {
        return null;
    }

    const changePage = (newPageIndex: number) => {
        addProductFilters({ page: newPageIndex });
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        addProductFilters({ pageSize: newPageSize });
    };

    const { pagination } = productsState.value;

    if (!pagination || !pagination.totalItemCount) {
        return null;
    }

    return (
        <Pagination
            {...styles.pagination}
            resultsCount={pagination!.totalItemCount}
            currentPage={pagination!.page}
            resultsPerPage={pagination!.pageSize}
            resultsPerPageOptions={pagination!.pageSizeOptions}
            onChangePage={changePage}
            onChangeResultsPerPage={changeResultsPerPage} />
    );
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(ProductListPagination),
    definition: {
        group: "Product List",
        displayName: "Pagination",
        allowedContexts: [ProductListPageContext],
        isSystem: true,
    },
};

export default widgetModule;
