import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React, { useState, useEffect } from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { connect } from "react-redux";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import { getLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { css } from "styled-components";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import EmblaCarousel from "embla-carousel";
import EmblaCarouselReact from "embla-carousel-react";
import Button, { ButtonIcon, ButtonPresentationProps } from "@insite/mobius/Button";
import ChevronRight from "@insite/mobius/Icons/ChevronRight";
import ChevronLeft from "@insite/mobius/Icons/ChevronLeft";
import { IconPresentationProps } from "@insite/mobius/Icon";
import parse from "html-react-parser";
import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import { HasHistory, History, withHistory } from "@insite/mobius/utilities/HistoryContext";
import getColor from "@insite/mobius/utilities/getColor";

interface SlideModel {
    fields: {
        slideTitle: string;
        background: "image" | "color";
        image: string;
        backgroundColor: string;
        heading: string;
        subheading: string;
        buttonLabel: string;
        buttonLink: LinkFieldValue;
        buttonVariant: "primary" | "secondary" | "tertiary";
    }
}

const enum fields {
    height = "height",
    textAalignment = "textAalignment",
    showArrows = "showArrows",
    slideIndicator = "slideIndicator",
    autoplay = "autoplay",
    slides = "slides",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.height]: "1/4 viewport" | "1/2 viewport" | "3/4 viewport" | "fullViewport";
        [fields.textAalignment]: "left" | "center" | "right";
        [fields.showArrows]: boolean;
        [fields.slideIndicator]: boolean;
        [fields.autoplay]: number;
        [fields.slides]: SlideModel[];
    };
    extendedStyles?: SlideshowStyles;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => {
    return {
        buttonLinks: ownProps.fields.slides.map(slide => getLink(state, slide.fields.buttonLink)),
    };
};

export interface SlideshowStyles {
    slideshowWrapper?: InjectableCss;
    prevArrowWrapper?: InjectableCss;
    prevArrowButton?: ButtonPresentationProps;
    iconProps?: IconPresentationProps;
    slideContainerWrapper?: InjectableCss;
    slideContentWrapper?: InjectableCss;
    headingText?: TypographyPresentationProps;
    subheadingText?: TypographyPresentationProps;
    slideButton?: ButtonPresentationProps;
    dotsContainerWrapper?: InjectableCss;
    dotButton?: ButtonPresentationProps;
    nextArrowWrapper?: InjectableCss;
    nextArrowButton?: ButtonPresentationProps;
}

export const slideshowStyles: SlideshowStyles = {
    slideshowWrapper: {
        css: css`
            padding: 10px 0;
            position: relative;
        `,
    },
    prevArrowWrapper: {
        css: css`
            position: absolute;
            z-index: 1;
            top: 50%;
            margin-top: -20px;
        `,
    },
    prevArrowButton: {
        css: css`
            background: none;
            border: 0;
            padding: 0;
            &:hover {
                background: none;
            }
            &:focus {
                outline: none;
            }
        `,
    },
    iconProps: {
        size: 35,
    },
    slideContainerWrapper: {
        css: css` display: flex; `,
    },
    slideContentWrapper: {
        css: css`
            flex: 0 0 100%;
            position: relative;
            color: white;
            padding: 70px 100px 50px 100px;
        `,
    },
    slideButton: {
        css: css` width: fit-content; `,
    },
    dotsContainerWrapper: {
        css: css`
            display: flex;
            justify-content: center;
            margin-top: -20px;
            position: absolute;
            width: 100%;
        `,
    },
    dotButton: {
        css: css`
            height: 3px;
            width: 30px;
            padding: 0;
            margin: 0 4px;
            border: 0;
            background: ${getColor("common.border")};
            &:hover, &:active {
                background: ${getColor("common.border")};
            }
            &:focus {
                outline: none;
            }
        `,
    },
    nextArrowWrapper: {
        css: css`
            position: absolute;
            z-index: 1;
            top: 50%;
            margin-top: -20px;
            right: 0;
        `,
    },
    nextArrowButton: {
        css: css`
            background: none;
            border: 0;
            padding: 0;
            &:hover {
                background: none;
            }
            &:focus {
                outline: none;
            }
        `,
    },
};

const onClick = (history: History, link: string | undefined) => {
    if (link) {
        history.push(link);
    }
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & HasHistory;

const Slideshow: React.FC<Props> = ({
    fields,
    buttonLinks,
    history,
    extendedStyles,
}) => {
    const [styles] = useState(() => mergeToNew(slideshowStyles, extendedStyles));

    const [embla, setEmbla] = useState<EmblaCarousel | null>(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
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
            embla.on("select", () => {
                setSelectedIndex(embla.selectedScrollSnap());
                setCanScroll();
            });

            return () => { embla && embla.destroy(); };
        },
        [embla],
    );

    useEffect(() => {
        if (!embla) {
            return;
        }

        const interval = setInterval(() => {
            embla.scrollNext();
        }, fields.autoplay * 1000);
        return () => clearInterval(interval);
    }, [fields.autoplay, embla]);

    let heightStyles: string;
    switch (fields.height) {
        case "1/4 viewport":
            heightStyles = "min-height: 25vh;";
            break;
        case "1/2 viewport":
            heightStyles = "min-height: 50vh;";
            break;
        case "3/4 viewport":
            heightStyles = "min-height: 75vh;";
            break;
        case "fullViewport":
            heightStyles = "min-height: 100vh;";
            break;
    }

    const textAlignStyles = `text-align: ${fields.textAalignment};`;

    return <StyledWrapper {...styles.slideshowWrapper}>
        {fields.showArrows && fields.slides.length > 1
            && <StyledWrapper {...styles.prevArrowWrapper}>
                <Button {...styles.prevArrowButton} onClick={() => embla && embla.scrollPrev()} disabled={!canScrollPrev}>
                    <ButtonIcon {...styles.iconProps} src={ChevronLeft} />
                </Button>
            </StyledWrapper>
        }
        <EmblaCarouselReact emblaRef={setEmbla} options={{ align: "start", loop: true }}>
            <StyledWrapper {...styles.slideContainerWrapper}>
                {fields.slides?.map((slide, index) => {
                    const buttonLink = buttonLinks[index];
                    const backgroundStyles = slide.fields.background === "image"
                        ? `background-image: url(${slide.fields.image});
                           background-size: cover;`
                        : `background-color: ${slide.fields.backgroundColor};`;
                    const slideWrapperStyles = {
                        css: css`
                            ${styles.slideContentWrapper?.css || ""}
                            ${heightStyles}
                            ${textAlignStyles}
                            ${backgroundStyles}
                        `,
                    };
                    return (
                        // eslint-disable-next-line react/no-array-index-key
                        <StyledWrapper key={index} {...slideWrapperStyles}>
                            {slide.fields.heading
                                && <Typography {...styles.headingText}>{parse(slide.fields.heading, parserOptions)}</Typography>
                            }
                            {slide.fields.subheading
                                && <Typography {...styles.subheadingText}>{parse(slide.fields.subheading, parserOptions)}</Typography>
                            }
                            {(slide.fields.buttonLabel || slide.fields.buttonLink.value)
                                && <Button {...styles.slideButton} variant={slide.fields.buttonVariant} onClick={() => onClick(history, buttonLink?.url)}>
                                    {slide.fields.buttonLabel || buttonLink?.title || buttonLink?.url}
                                </Button>
                            }
                        </StyledWrapper>
                    );
                })}
            </StyledWrapper>
        </EmblaCarouselReact>
        {fields.slideIndicator
            && <StyledWrapper {...styles.dotsContainerWrapper}>
                {fields.slides?.map((slide, snapIndex) => {
                    const dotColorStyles = snapIndex === selectedIndex
                        ? `background: white;
                           &:hover{ background: white; }`
                        : "";
                    const dotButtonStyles = {
                        css: css`
                            ${styles.dotButton?.css || ""}
                            ${dotColorStyles}
                        `,
                    };
                    // eslint-disable-next-line react/no-array-index-key
                    return <Button {...dotButtonStyles} onClick={() => embla && embla.scrollTo(snapIndex)} key={snapIndex}></Button>;
                })}
            </StyledWrapper>
        }
        {fields.showArrows && fields.slides.length > 1
            && <StyledWrapper {...styles.nextArrowWrapper}>
                <Button {...styles.nextArrowButton} onClick={() => embla && embla.scrollNext()} disabled={!canScrollNext}>
                    <ButtonIcon {...styles.iconProps} src={ChevronRight} />
                </Button>
            </StyledWrapper>
        }
    </StyledWrapper>;
};

const contentTab = {
    displayName: "Content",
    sortOrder: 0,
};

const settingsTab = {
    displayName: "Settings",
    sortOrder: 1,
};

const widgetModule: WidgetModule = {
    component: withHistory(connect(mapStateToProps)(Slideshow)),
    definition: {
        group: "Basic",
        icon: "Carousel",
        fieldDefinitions: [
            {
                name: fields.height,
                editorTemplate: "DropDownField",
                fieldType: "General",
                options: [
                    { displayName: "1/4 Viewport", value: "1/4 viewport" },
                    { displayName: "1/2 Viewport", value: "1/2 viewport" },
                    { displayName: "3/4 Viewport", value: "3/4 viewport" },
                    { displayName: "Full Viewport", value: "fullViewport" },
                ],
                defaultValue: "1/4 viewport",
                hideEmptyOption: true,
                tab: settingsTab,
            },
            {
                name: fields.textAalignment,
                editorTemplate: "DropDownField",
                defaultValue: "center",
                fieldType: "General",
                options: [
                    { displayName: "Left", value: "left" },
                    { displayName: "Center", value: "center" },
                    { displayName: "Right", value: "right" },
                ],
                hideEmptyOption: true,
                tab: settingsTab,
            },
            {
                name: fields.showArrows,
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                tab: settingsTab,
            },
            {
                name: fields.slideIndicator,
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                tab: settingsTab,
            },
            {
                name: fields.autoplay,
                editorTemplate: "IntegerField",
                defaultValue: 10,
                fieldType: "General",
                tab: settingsTab,
                min: 1,
            },
            {
                name: fields.slides,
                editorTemplate: "ListField",
                tab: contentTab,
                getDisplay: (item: HasFields) => {
                    return item.fields.slideTitle;
                },
                defaultValue: [],
                fieldType: "General",
                fieldDefinitions: [
                    {
                        name: "slideTitle",
                        editorTemplate: "TextField",
                        defaultValue: "Slide",
                    },
                    {
                        name: "background",
                        displayName: "Background",
                        editorTemplate: "DropDownField",
                        options: [
                            { displayName: "Image", value: "image" },
                            { displayName: "Color", value: "color" },
                        ],
                        defaultValue: "image",
                        hideEmptyOption: true,
                    },
                    {
                        name: "image",
                        editorTemplate: "ImagePickerField",
                        defaultValue: "",
                        isVisible: widget => widget.fields.background === "image",
                    },
                    {
                        name: "backgroundColor",
                        editorTemplate: "ColorPickerField",
                        displayName: "Color",
                        defaultValue: "black",
                        isVisible: widget => widget.fields.background === "color",
                    },
                    {
                        name: "heading",
                        editorTemplate: "RichTextField",
                        displayName: "Heading",
                        defaultValue: "",
                        extendedConfig: { height: 100 },
                        expandedToolbarButtons: {
                            moreMisc: {},
                            code: {},
                        },
                    },
                    {
                        name: "subheading",
                        editorTemplate: "RichTextField",
                        displayName: "Subheading",
                        defaultValue: "",
                        extendedConfig: { height: 170 },
                        expandedToolbarButtons: {
                            moreMisc: {},
                            code: {},
                        },
                    },
                    {
                        name: "buttonLabel",
                        editorTemplate: "TextField",
                        displayName: "Button Label",
                        defaultValue: "",
                    },
                    {
                        name: "buttonLink",
                        displayName: "Button Link",
                        editorTemplate: "LinkField",
                        defaultValue: { type: "Page", value: "" },
                    },
                    {
                        name: "buttonVariant",
                        displayName: "Button Variant",
                        editorTemplate: "DropDownField",
                        options: [
                            { displayName: "Primary", value: "primary" },
                            { displayName: "Secondary", value: "secondary" },
                            { displayName: "Tertiary", value: "tertiary" },
                        ],
                        hideEmptyOption: true,
                        defaultValue: "primary",
                    },
                ],
            },
        ],
    },
};

export default widgetModule;
