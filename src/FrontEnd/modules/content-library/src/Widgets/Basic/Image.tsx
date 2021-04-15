import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { useGetLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { FC } from "react";
import { css } from "styled-components";

const enum fields {
    imageUrl = "imageUrl",
    altText = "altText",
    imageLink = "imageLink",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.imageUrl]: string;
        [fields.altText]: string;
        [fields.imageLink]: LinkFieldValue;
    };
}

export interface ImageStyles {
    wrapper?: InjectableCss;
    image?: LazyImageProps;
    imageLink?: LinkPresentationProps;
}

export const imageStyles: ImageStyles = {
    image: {
        css: css`
            max-width: 100%;
        `,
    },
};

const styles = imageStyles;

const Image: FC<OwnProps> = ({ fields }) => {
    const { url } = useGetLink(fields.imageLink);
    const image = <LazyImage src={fields.imageUrl} altText={fields.altText} {...styles.image} />;

    return (
        <StyledWrapper {...styles.wrapper}>
            {url ? (
                <Link href={url} {...styles.imageLink}>
                    {image}
                </Link>
            ) : (
                image
            )}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: Image,
    definition: {
        group: "Basic",
        icon: "Image",
        fieldDefinitions: [
            {
                name: fields.imageUrl,
                fieldType: "General",
                editorTemplate: "ImagePickerField",
                defaultValue: "",
            },
            {
                name: fields.altText,
                fieldType: "General",
                editorTemplate: "TextField",
                defaultValue: "",
            },
            {
                name: fields.imageLink,
                fieldType: "General",
                editorTemplate: "LinkField",
                defaultValue: { type: "Page", value: "" },
            },
        ],
    },
};

export default widgetModule;
