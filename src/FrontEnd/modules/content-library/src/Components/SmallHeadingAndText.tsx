import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import React from "react";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { css } from "styled-components";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import wrapInContainerStyles from "@insite/client-framework/Common/wrapInContainerStyles";

interface OwnProps {
    heading: string;
    text: string | number;
    extendedStyles?: SmallHeadingAndTextStyles;
}

export interface SmallHeadingAndTextStyles {
    wrapper?: InjectableCss;
    heading?: TypographyProps;
    text?: TypographyProps;
}

export const smallHeadingAndTextStyles: SmallHeadingAndTextStyles = {
    wrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            width: 100%;
        `,
    },
    heading: {
        variant: "legend",
    },
    text: {
        css: css`
            width: 100%;
            ${wrapInContainerStyles}
        `,
    },
};

const SmallHeadingAndText: React.FunctionComponent<OwnProps> = ({ heading, text, extendedStyles }) => {
    const [styles] = React.useState(() => mergeToNew(smallHeadingAndTextStyles, extendedStyles));

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography as="p" {...styles.heading}>{heading}</Typography>
            <Typography as="p" {...styles.text}>{text}</Typography>
        </StyledWrapper>
    );
};

export default SmallHeadingAndText;
