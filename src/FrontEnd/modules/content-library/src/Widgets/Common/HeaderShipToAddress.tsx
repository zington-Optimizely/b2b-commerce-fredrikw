import React, { FC } from "react";
import { css } from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import translate from "@insite/client-framework/Translate";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon/Icon";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import MapPin from "@insite/mobius/Icons/MapPin";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography/Typography";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";

export interface HeaderShipToAddressStyles {
    shipToAddressWrapper?: InjectableCss;
    titleClickable?: ClickablePresentationProps;
    titleIcon?: IconPresentationProps;
    titleTypography?: TypographyPresentationProps;
}

const styles: HeaderShipToAddressStyles = {
    shipToAddressWrapper: {
        css: css` display: inline-flex; `,
    },
    titleClickable: {
        css: css` margin-left: 10px; `,
    },
    titleIcon: {
        size: 22,
    },
    titleTypography: {
        css: css` margin-left: 10px; `,
        transform: "uppercase",
    },
};

interface OwnProps extends WidgetProps {
    fields: {};
}

export const headerShipToAddressStyles = styles;

const HeaderShipToAddress: FC<OwnProps> = (props) => (
    <StyledWrapper {...styles.shipToAddressWrapper}>
        <Clickable {...styles.titleClickable} disabled onClick={() => {}} data-test-selector="header_shipToAddress">
            {/* As this doesn't look final, but is the pattern on which the mobile nav drawer was based,
            please also make changes to `NavigationDrawer.tsx` when you change this. */}
            <Icon
                {...styles.titleIcon}
                color="common.disabled"
                src={MapPin}
            />
            <Typography {...styles.titleTypography}>{translate("Ship To Address")}</Typography>
        </Clickable>
    </StyledWrapper>
);

const widgetModule: WidgetModule = {
    component: HeaderShipToAddress,
    definition: {
        displayName: "Header Ship To Address Menu",
        icon: "MapPin",
        fieldDefinitions: [],
        group: "Common",
    },
};

export default widgetModule;
