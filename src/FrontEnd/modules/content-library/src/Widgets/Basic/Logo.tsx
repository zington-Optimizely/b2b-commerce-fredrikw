import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import * as React from "react";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Link from "@insite/mobius/Link";
import translate from "@insite/client-framework/Translate";
import { css } from "styled-components";

const enum fields {
    logoImage = "logoImage",
    isMobileSpecific = "isMobileSpecific",
    mobileSpecificImage = "mobileSpecificImage",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.logoImage]: string;
        [fields.isMobileSpecific]: boolean;
        [fields.mobileSpecificImage]: string;
    };
    extendedStyles?: LogoStyles;
}

type Props = OwnProps;

export interface LogoStyles {
    wrapper?: InjectableCss;
}

export const logoStyles: LogoStyles = {
    wrapper: {
        css: css`
            max-width: 110px;
            max-height: 110px;
            img {
                width: 100%;
            }
        `,
    },
};

const Logo: React.FunctionComponent<Props> = ({
    fields,
    ...otherProps
}: Props) => {
    const [styles] = React.useState(() => mergeToNew(logoStyles, otherProps.extendedStyles));

    return <StyledWrapper {...styles.wrapper}>
        <Link href="/">
            <img src={fields.logoImage} alt={translate("home")}/>
        </Link>
    </StyledWrapper>;
};

const widgetModule: WidgetModule = {
    component: Logo,
    definition: {
        group: "Basic",
        icon: "Logo",
        fieldDefinitions: [
            {
                name: fields.logoImage,
                displayName: "Logo Image",
                editorTemplate: "ImagePickerField",
                defaultValue: "",
                fieldType: "Translatable",
            },
            {
                name: fields.isMobileSpecific,
                displayName: "Mobile Specific Image",
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
                isRequired: true,
                variant: "toggle",
            },
            {
                name: fields.mobileSpecificImage,
                displayName: "Mobile Logo",
                editorTemplate: "ImagePickerField",
                defaultValue: "",
                fieldType: "Translatable",
                isVisible: widget => widget.fields.isMobileSpecific,
            },
        ],
    },
};

export default widgetModule;
