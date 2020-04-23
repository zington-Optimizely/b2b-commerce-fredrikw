import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import Typography from "@insite/mobius/Typography";
import parse from "html-react-parser";
import styled, { css } from "styled-components";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { connect } from "react-redux";
import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import { getLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";

const enum fields {
    background = "background",
    image = "image",
    focalPoint = "focalPoint",
    backgroundColor = "backgroundColor",
    heading = "heading",
    minimumHeight = "minimumHeight",
    subheading = "subheading",
    buttonLabel = "buttonLabel",
    buttonLink = "buttonLink",
    bannerWidth = "bannerWidth",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.background]: "image" | "color";
        [fields.image]: string;
        [fields.focalPoint]: "topLeft" | "topCenter" | "topRight" | "centerLeft" | "center" | "centerRight" | "bottomLeft" | "bottomCenter" | "bottomRight";
        [fields.backgroundColor]: string;
        [fields.heading]: string;
        [fields.minimumHeight]: "1/4 viewport" | "1/2 viewport" | "3/4 viewport" | "fullViewport";
        [fields.subheading]: string;
        [fields.buttonLabel]: string;
        [fields.buttonLink]: LinkFieldValue;
    };
    extendedStyles?: BannerStyles;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => {
    const link = getLink(state, ownProps.fields.buttonLink);
    return {
        url: link?.url,
        title: link?.title,
    };
};

export interface BannerStyles {
    wrapper?: InjectableCss;
    bannerLink?: LinkPresentationProps;
}

export const bannerStyles: BannerStyles = {
    wrapper: {
        css: css`
            width: 100%;
            color: white;
            text-align: center;
            padding: 80px 100px 10px 100px;
        `,
    },
    bannerLink: {
        css: css`
            border: 1px solid white;
            padding: 10px;
            margin-top: 10px;
        `,
        color: "white",
    },
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const Banner: React.FC<Props> = ({
    fields,
    url,
    title,
    extendedStyles,
}) => {
    const backgroundStyles = fields.background === "image"
        ? `background-image: url(${fields.image});
           background-size: cover;`
        : `background-color: ${fields.backgroundColor};`;

    let focalPointStyles;
    switch (fields.focalPoint) {
    case "topLeft":
        focalPointStyles = "background-position: left top;";
        break;
    case "topCenter":
        focalPointStyles = "background-position: center top;";
        break;
    case "topRight":
        focalPointStyles = "background-position: right top;";
        break;
    case "centerLeft":
        focalPointStyles = "background-position: left center;";
        break;
    case "center":
        focalPointStyles = "background-position: center center;";
        break;
    case "centerRight":
        focalPointStyles = "background-position: right center;";
        break;
    case "bottomLeft":
        focalPointStyles = "background-position: left bottom;";
        break;
    case "bottomCenter":
        focalPointStyles = "background-position: center bottom;";
        break;
    case "bottomRight":
        focalPointStyles = "background-position: right bottom;";
        break;
    }

    let minimumHeightStyles;
    switch (fields.minimumHeight) {
    case "1/4 viewport":
        minimumHeightStyles = "min-height: 25vh;";
        break;
    case "1/2 viewport":
        minimumHeightStyles = "min-height: 50vh;";
        break;
    case "3/4 viewport":
        minimumHeightStyles = "min-height: 75vh;";
        break;
    case "fullViewport":
        minimumHeightStyles = "min-height: 100vh;";
        break;
    }

    const [styles] = React.useState(() => mergeToNew(bannerStyles, extendedStyles));
    const Wrapper = styled.div`
        ${styles.wrapper?.css || ""}
        ${backgroundStyles}
        ${focalPointStyles}
        ${minimumHeightStyles}
    `;

    return <Wrapper>
        <Typography>{parse(fields.heading, parserOptions)}</Typography>
        <Typography>{parse(fields.subheading, parserOptions)}</Typography>
        <Link {...styles.bannerLink} href={url}>{fields.buttonLabel || title || url}</Link>
    </Wrapper>;
};

const banner: WidgetModule = {
    component: connect(mapStateToProps)(Banner),
    definition: {
        group: "Basic",
        icon: "Banner",
        fieldDefinitions: [
            {
                fieldType: "General",
                name: fields.background,
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
                fieldType: "Translatable",
                name: fields.image,
                editorTemplate: "ImagePickerField",
                defaultValue: "",
                isVisible: widget => widget.fields.background === "image",
            },
            {
                fieldType: "General",
                name: fields.focalPoint,
                displayName: "Focal Point",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "Top Left", value: "topLeft" },
                    { displayName: "Top Center", value: "topCenter" },
                    { displayName: "Top Right", value: "topRight" },
                    { displayName: "Center Left", value: "centerLeft" },
                    { displayName: "Center", value: "center" },
                    { displayName: "Center Right", value: "centerRight" },
                    { displayName: "Bottom Left", value: "bottomLeft" },
                    { displayName: "Bottom Center", value: "bottomCenter" },
                    { displayName: "Bottom Right", value: "bottomRight" },
                ],
                defaultValue: "center",
                hideEmptyOption: true,
                isVisible: widget => widget.fields.background === "image",
            },
            {
                fieldType: "General",
                name: fields.backgroundColor,
                editorTemplate: "ColorPickerField",
                displayName: "Color",
                defaultValue: "black",
                isVisible: widget => widget.fields.background === "color",
            },
            {
                fieldType: "Translatable",
                name: fields.heading,
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
                fieldType: "Translatable",
                name: fields.subheading,
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
                fieldType: "Translatable",
                name: fields.buttonLabel,
                editorTemplate: "TextField",
                displayName: "Button Label",
                defaultValue: "",
            },
            {
                fieldType: "General",
                name: fields.buttonLink,
                displayName: "Button Link",
                editorTemplate: "LinkField",
                defaultValue: { type: "Page", value: "" },
            },
            {
                fieldType: "General",
                name: fields.minimumHeight,
                displayName: "Minimum Banner Height",
                editorTemplate: "DropDownField",
                options: [
                    { displayName: "1/4 Viewport", value: "1/4 viewport" },
                    { displayName: "1/2 Viewport", value: "1/2 viewport" },
                    { displayName: "3/4 Viewport", value: "3/4 viewport" },
                    { displayName: "Full Viewport", value: "fullViewport" },
                ],
                defaultValue: "1/4 viewport",
                hideEmptyOption: true,
            },
        ],
    },
};

export default banner;
