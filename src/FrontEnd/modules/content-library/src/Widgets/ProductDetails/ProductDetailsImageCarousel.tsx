import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProductContext, withProduct } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import setSelectedImage from "@insite/client-framework/Store/Pages/ProductDetail/Handlers/SetSelectedImage";
import { ImageModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductDetailPageContext } from "@insite/content-library/Pages/ProductDetailPage";
import Button, { ButtonIcon, ButtonProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import ChevronLeft from "@insite/mobius/Icons/ChevronLeft";
import ChevronRight from "@insite/mobius/Icons/ChevronRight";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import EmblaCarousel from "embla-carousel";
import EmblaCarouselReact from "embla-carousel-react";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    productSettings: getSettingsCollection(state).productSettings,
    selectedImage: state.pages.productDetail.selectedImage,
});

const mapDispatchToProps = {
    setSelectedImage,
};

type Props = WidgetProps & HasProductContext & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface ProductDetailsImageCarouselStyles {
    mainContainer?: GridContainerProps;
    prevArrowGridItem?: GridItemProps;
    prevArrowButton?: ButtonProps;
    carouselGridItem?: GridItemProps;
    carouselWrapper?: InjectableCss;
    carouselSlidesContainer?: InjectableCss;
    carouselSlide?: InjectableCss;
    carouselSlideInner?: InjectableCss;
    image?: LazyImageProps;
    selectedImage?: LazyImageProps;
    nextArrowGridItem?: GridItemProps;
    nextArrowButton?: ButtonProps;
}

const getImageCss = (borderColor: string) => css`
    width: 100%;
    height: 100%;
    max-width: 64px;
    max-height: 64px;
    border: 1px solid ${getColor(borderColor)};
    cursor: pointer;
    justify-content: flex-start;
    img {
        max-width: 64px;
        max-height: 64px;
        padding: 3px;
    }
`;

const styles: ProductDetailsImageCarouselStyles = {
    mainContainer: { gap: 0 },
    prevArrowGridItem: {
        width: 1,
        align: "middle",
        css: css` justify-content: flex-end; `,
    },
    prevArrowButton: {
        variant: "secondary",
        color: "text.main",
        css: css`
            border: 0;
            padding: 0;
        `,
    },
    carouselGridItem: { width: 10 },
    carouselWrapper: {
        css: css`
            width: 100%;
        `,
    },
    carouselSlidesContainer: {
        css: css` display: flex; `,
    },
    carouselSlide: {
        css: css`
            flex: 0 0 ${100 / 6}%;
            padding: 0;
            position: relative;
        `,
    },
    carouselSlideInner: {
        css: css`
            width: 100%;
            text-align: center;
            position: relative;
            padding: 10px 3px 0;
        `,
    },
    image: {
        css: getImageCss("common.border"),
    },
    selectedImage: {
        css: getImageCss("text.main"),
    },
    nextArrowGridItem: {
        width: 1,
        align: "middle",
        css: css` justify-content: flex-start; `,
    },
    nextArrowButton: {
        variant: "secondary",
        color: "text.main",
        css: css`
            border: 0;
            padding: 0;
        `,
    },
};

export const productDetailsImageCarouselStyles = styles;

const ProductDetailsImageCarousel: React.FC<Props> = ({
    productSettings,
    product,
    selectedImage,
    setSelectedImage,
}) => {
    if (!product || !product.images) {
        return null;
    }

    const [embla, setEmbla] = useState<EmblaCarousel | null>(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const setCanScroll = () => {
        setCanScrollPrev(!!embla && embla.canScrollPrev());
        setCanScrollNext(!!embla && embla.canScrollNext());
    };

    useEffect(
        () => {
            if (!embla) {
                return;
            }

            embla.on("init", setCanScroll);
            embla.on("select", setCanScroll);

            return () => { embla && embla.destroy(); };
        },
        [embla],
    );

    const getProductImageThumbPath = (productImage: ImageModel) => {
        if (productImage.imageType === "Static") {
            return productImage.smallImagePath || productImage.mediumImagePath;
        }
        if (productImage.imageType === "360" && productSettings.imageProvider === "SIRV") {
            return productImage.mediumImagePath + (productImage.mediumImagePath.indexOf("?") > 0 ? "&thumb" : "?thumb");
        }
        return "";
    };

    if (product.images?.length === 0) {
        return null;
    }

    return (<GridContainer {...styles.mainContainer} key={product.id}>
        <GridItem {...styles.prevArrowGridItem}>
            {product.images.length > 6
                && <Button {...styles.prevArrowButton} onClick={() => embla && embla.scrollPrev()} disabled={!canScrollPrev}>
                    <ButtonIcon src={ChevronLeft} />
                </Button>
            }
        </GridItem>
        <GridItem {...styles.carouselGridItem}>
            <StyledWrapper {...styles.carouselWrapper}>
                <EmblaCarouselReact emblaRef={setEmbla} options={{ align: product.images.length > 6 ? "start" : "center", slidesToScroll: 6 }}>
                    <StyledWrapper {...styles.carouselSlidesContainer}>
                        {product.images.map(productImage =>
                            <StyledWrapper {...styles.carouselSlide} key={productImage.id}>
                                <StyledWrapper {...styles.carouselSlideInner}>
                                    <LazyImage
                                        {...(productImage.mediumImagePath === selectedImage?.mediumImagePath ? styles.selectedImage : styles.image)}
                                        src={getProductImageThumbPath(productImage)}
                                        altText={productImage.imageAltText}
                                        onClick={() => setSelectedImage({ productImage })} />
                                </StyledWrapper>
                            </StyledWrapper>)
                        }
                    </StyledWrapper>
                </EmblaCarouselReact>
            </StyledWrapper>
        </GridItem>
        <GridItem {...styles.nextArrowGridItem}>
            {product.images.length > 6
                && <Button {...styles.nextArrowButton} onClick={() => embla && embla.scrollNext()} disabled={!canScrollNext}>
                    <ButtonIcon src={ChevronRight} />
                </Button>
            }
        </GridItem>
    </GridContainer>);
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withProduct(ProductDetailsImageCarousel)),
    definition: {
        displayName: "Image Carousel",
        group: "Product Details",
        allowedContexts: [ProductDetailPageContext],
    },
};

export default widgetModule;
