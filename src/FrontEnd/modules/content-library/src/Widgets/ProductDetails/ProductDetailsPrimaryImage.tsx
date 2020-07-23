import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import LazyImage from "@insite/mobius/LazyImage";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

type Props = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
    selectedImage: state.pages.productDetail.selectedImage,
});

export interface ProductDetailsPrimaryImageStyles {
    centeringWrapper?: InjectableCss;
    hiddenWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
}

const styles: ProductDetailsPrimaryImageStyles = {
    centeringWrapper: {
        css: css`
            min-height: 300px;
            margin: 10px 0;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
                height: auto;
                max-width: 100%;
            }
        `,
    },
    hiddenWrapper: {
        css: css` display: none; `,
    },
    spinner: {
        css: css` margin: auto; `,
    },
};

export const primaryImageStyles = styles;

const ProductDetailsPrimaryImage: React.FC<Props> = ({
    productSettings,
    product,
    selectedImage,
}) => {
    if (!product || !selectedImage) {
        return null;
    }

    const [lastHeight, setLastHeight] = React.useState(300);
    const [lastInstance, setLastInstance] = React.useState<HTMLElement | null>(null);
    const setRefHandler = (instance: HTMLElement | null) => {
        if (instance) {
            setLastInstance(instance);
        }
    };

    const [isLoading, setIsLoading] = React.useState(false);
    const onLoadHandler = React.useCallback(
        () => {
            setIsLoading(false);
            setTimeout(
                () => {
                    if (lastInstance && lastInstance.clientHeight > 0) {
                        setLastHeight(lastInstance.clientHeight);
                    }
                },
                100,
            );
        },
        [setIsLoading, lastInstance, setLastHeight],
    );

    React.useEffect(
        () => {
            if (selectedImage.imageType === "Static") {
                setIsLoading(true);
            }
        },
        [selectedImage.id],
    );

    React.useEffect(
        () => {
            if ((window as any).sirvScriptAdded) {
                return;
            }

            if (productSettings.imageProvider !== "SIRV" || !product.images || product.images.every(o => o.imageType !== "360")) {
                return;
            }

            const script = document.createElement("script");
            script.src = "https://scripts.sirv.com/sirv.js";
            script.async = true;

            document.body.appendChild(script);
            (window as any).sirvScriptAdded = true;
        },
        [productSettings.imageProvider, product],
    );

    const path = selectedImage.mediumImagePath || selectedImage.largeImagePath;
    if (!path) {
        return null;
    }

    return <>
        {isLoading
            && <StyledWrapper {...styles.centeringWrapper} style={{ height: lastHeight }}>
                <LoadingSpinner {...styles.spinner} />
            </StyledWrapper>
        }
        {selectedImage.imageType === "Static"
            && <StyledWrapper {...(isLoading ? styles.hiddenWrapper : styles.centeringWrapper)}>
                <LazyImage
                    key={selectedImage.id}
                    src={path}
                    altText={selectedImage.imageAltText}
                    imgProps={{ ref: setRefHandler }}
                    onLoad={onLoadHandler}
                    onError={onLoadHandler}
                    data-test-selector="productDetails_mainImage"
                />
            </StyledWrapper>
        }
        {selectedImage.imageType === "360" && productSettings.imageProvider === "SIRV"
            && <div style={{ minHeight: lastHeight }}>
                <div className="Sirv" key={selectedImage.id} data-src={selectedImage.mediumImagePath} />
            </div>
        }
    </>;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withProduct(ProductDetailsPrimaryImage)),
    definition: {
        displayName: "Primary Image",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
    },
};

export default widgetModule;
