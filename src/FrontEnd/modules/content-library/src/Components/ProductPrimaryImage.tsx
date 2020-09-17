import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { ImageModel, ProductModel } from "@insite/client-framework/Types/ApiModels";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    product: ProductModel;
    image: ImageModel;
    useLargeImage?: boolean;
    onClick?: () => void;
    extendedStyles?: ProductPrimaryImageStyles;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
});

export interface ProductPrimaryImageStyles {
    centeringWrapper?: InjectableCss;
    hiddenWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    image?: LazyImageProps;
}

export const productPrimaryImageStyles: ProductPrimaryImageStyles = {
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
        css: css`
            display: none;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    image: {
        css: css`
            cursor: pointer;
        `,
    },
};

const ProductPrimaryImage = ({ productSettings, product, image, useLargeImage, onClick, extendedStyles }: Props) => {
    const [styles] = useState(() => mergeToNew(productPrimaryImageStyles, extendedStyles));

    const [lastHeight, setLastHeight] = useState(300);
    const [lastInstance, setLastInstance] = useState<HTMLElement | null>(null);
    const setRefHandler = (instance: HTMLElement | null) => {
        if (instance) {
            setLastInstance(instance);
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    const onLoadHandler = useCallback(() => {
        setIsLoading(false);
        setTimeout(() => {
            if (lastInstance && lastInstance.clientHeight > 0) {
                setLastHeight(lastInstance.clientHeight);
            }
        }, 100);
    }, [setIsLoading, lastInstance, setLastHeight]);

    useEffect(() => {
        if (image?.imageType === "Static") {
            setIsLoading(true);
        }
    }, [image?.id]);

    if (!product) {
        return null;
    }

    useEffect(() => {
        if ((window as any).sirvScriptAdded) {
            return;
        }

        if (
            productSettings.imageProvider !== "SIRV" ||
            !product.images ||
            product.images.every(o => o.imageType !== "360")
        ) {
            return;
        }

        const script = document.createElement("script");
        script.src = "https://scripts.sirv.com/sirv.js";
        script.async = true;

        document.body.appendChild(script);
        (window as any).sirvScriptAdded = true;
    }, [productSettings.imageProvider, product]);

    const imageWrapperClickHandler = () => {
        onClick?.();
    };

    const path = useLargeImage
        ? image.largeImagePath || image.mediumImagePath
        : image.mediumImagePath || image.largeImagePath;
    if (!path) {
        return null;
    }

    return (
        <>
            {isLoading && (
                <StyledWrapper {...styles.centeringWrapper} style={{ height: lastHeight }}>
                    <LoadingSpinner {...styles.spinner} />
                </StyledWrapper>
            )}
            {image.imageType === "Static" && (
                <StyledWrapper
                    {...(isLoading ? styles.hiddenWrapper : styles.centeringWrapper)}
                    onClick={imageWrapperClickHandler}
                >
                    <LazyImage
                        {...styles.image}
                        key={image.id}
                        src={path}
                        altText={image.imageAltText}
                        imgProps={{ ref: setRefHandler }}
                        onLoad={onLoadHandler}
                        onError={onLoadHandler}
                        data-test-selector="productDetails_mainImage"
                    />
                </StyledWrapper>
            )}
            {image.imageType === "360" && productSettings.imageProvider === "SIRV" && (
                <div style={{ minHeight: lastHeight }} onClick={imageWrapperClickHandler}>
                    <div className="Sirv" key={image.id} data-src={image.mediumImagePath} />
                </div>
            )}
        </>
    );
};

export default connect(mapStateToProps)(ProductPrimaryImage);
