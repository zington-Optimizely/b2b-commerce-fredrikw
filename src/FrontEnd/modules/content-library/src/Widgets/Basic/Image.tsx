import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import { css } from "styled-components";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLink } from "@insite/client-framework/Store/Links/LinksSelectors";
import { LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import { connect } from "react-redux";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";

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

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => {
    const link = getLink(state, ownProps.fields.imageLink);
    return { pageUrl: link?.url };
};

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface ImageStyles {
    wrapper?: InjectableCss;
    image?: LazyImageProps;
    imageLink?: LinkPresentationProps;
}

const styles: ImageStyles = {
    image: {
        css: css` max-width: 100%; `,
    },
};

export const imageStyles = styles;

const Image: React.FunctionComponent<Props> = ({
    fields,
    pageUrl,
}: Props) => {
    const image = <LazyImage src={fields.imageUrl} altText={fields.altText} {...styles.image} />;

    return <StyledWrapper {...styles.wrapper}>
        {pageUrl
            ? <Link href={pageUrl} {...styles.imageLink}>{image}</Link>
            : image}
    </StyledWrapper>;
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(Image),
    definition: {
        group: "Basic",
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
