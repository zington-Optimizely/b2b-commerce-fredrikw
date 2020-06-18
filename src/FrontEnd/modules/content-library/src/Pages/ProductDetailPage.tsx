import * as React from "react";
import Zone from "@insite/client-framework/Components/Zone";
import PageModule from "@insite/client-framework/Types/PageModule";
import { connect, ResolveThunks } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import PageProps from "@insite/client-framework/Types/PageProps";
import loadProduct from "@insite/client-framework/Store/Pages/ProductDetail/Handlers/LoadProduct";
import { ProductContext } from "@insite/client-framework/Components/ProductContext";
import Page from "@insite/mobius/Page";
import CurrentCategory from "@insite/content-library/Components/CurrentCategory";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { getSelectedProductPath } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCurrentPage, getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { setOpenGraphInfo } from "@insite/client-framework/Common/Utilities/setOpenGraphInfo";

const mapStateToProps = (state: ApplicationState) => {
    const location = getLocation(state);
    const productPath = getSelectedProductPath(state) || (location.pathname.toLowerCase().startsWith("/content/") ? "" : location.pathname);
    return ({
        product: state.pages.productDetail.product,
        productPath,
        lastProductPath: state.pages.productDetail.lastProductPath,
        websiteName: state.context.website.name,
        page: getCurrentPage(state),
        pages: state.pages,
        location,
    });
};

const mapDispatchToProps = {
    loadProduct,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & PageProps;

class ProductDetailPage extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        this.loadProductIfNeeded();
    }

    componentDidUpdate(prevProps: Props): void {
        this.loadProductIfNeeded();
        setOpenGraphInfo(this.props.pages, this.props.page.type, null, this.props.websiteName);
    }

    loadProductIfNeeded() {
        const { productPath, lastProductPath, location: { search } } = this.props;
        if (productPath.toLowerCase() !== lastProductPath?.toLowerCase()) {
            const queryParams = parseQueryString<{ option?: string; criteria?: string; }>(search.replace("?", ""));
            const styledOption = (queryParams.option?.toString() || queryParams.criteria?.toString() || "").toLocaleLowerCase();
            this.props.loadProduct({ path: productPath, styledOption });
        }
    }

    render() {
        if (!this.props.product) {
            return null;
        }

        return <Page data-test-selector={`productDetails_productId_${this.props.product.id}`}>
            <CurrentCategory>
                <ProductContext.Provider value={this.props.product}>
                    <Zone contentId={this.props.id} zoneName="Content"/>
                </ProductContext.Provider>
            </CurrentCategory>
            <AddToListModal />
        </Page>;
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductDetailPage),
    definition: {
        hasEditableUrlSegment: false,
        hasEditableTitle: false,
        supportsProductSelection: true,
        isSystemPage: true,
    },
};

export default pageModule;

export const ProductDetailPageContext = "ProductDetailPage";
