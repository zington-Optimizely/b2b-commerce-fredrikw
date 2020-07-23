import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { setOpenGraphInfo } from "@insite/client-framework/Common/Utilities/setOpenGraphInfo";
import { ProductContext } from "@insite/client-framework/Components/ProductContext";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSelectedProductPath } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCurrentPage, getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import loadProduct from "@insite/client-framework/Store/Pages/ProductDetail/Handlers/LoadProduct";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import AddToListModal from "@insite/content-library/Components/AddToListModal";
import CurrentCategory from "@insite/content-library/Components/CurrentCategory";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

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
            this.props.loadProduct({ path: productPath, styledOption, addToRecentlyViewed: true });
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
        pageType: "System",
    },
};

export default pageModule;

export const ProductDetailPageContext = "ProductDetailPage";
