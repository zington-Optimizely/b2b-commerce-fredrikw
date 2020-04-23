import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect } from "react-redux";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import { css } from "styled-components";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";

type Props = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
    selectedImage: state.pages.productDetail.selectedImage,
});

export interface ProductDetailsPrimaryImageStyles {
    centeringWrapper?: InjectableCss;
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
        [selectedImage],
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
        {selectedImage.imageType ===  "Static"
            && <StyledWrapper {...styles.centeringWrapper}>
                <img
                    ref={setRefHandler}
                    key={selectedImage.id}
                    src={path}
                    alt={selectedImage.imageAltText}
                    onLoad={onLoadHandler}
                    onError={onLoadHandler}
                    style={{ display: isLoading ? "none" : "block" }}
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
        fieldDefinitions: [],
    },
};

export default widgetModule;
