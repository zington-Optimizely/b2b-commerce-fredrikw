import React, { FC } from "react";
import styled from "styled-components";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import Hidden from "@insite/mobius/Hidden";
import getColor from "@insite/mobius/utilities/getColor";
import getContrastColor from "@insite/mobius/utilities/getContrastColor";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Zone from "@insite/client-framework/Components/Zone";

const Navigation = styled.div`
    color: ${getContrastColor("common.accent")};
    font-size: 15px;
    background-color: ${getColor("common.accent")};
    padding: 9px 45px 4px 45px;
    text-transform: uppercase;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const NavItem = styled.span`
    display: inline-flex;
    margin-left: 30px;

    > span, > a {
        margin-left: 10px;
    }
`;

const SecondaryNavigation: FC<WidgetProps> = ({ id }) => {
    return (
        <Hidden below="lg">
            <Navigation>
                <NavItem>
                    <Zone zoneName="Currency" contentId={id} fixed />
                </NavItem>
                <NavItem>
                    <Zone zoneName="Language" contentId={id} fixed />
                </NavItem>
                <NavItem>
                    <Zone zoneName="ShipToAddress" contentId={id} fixed />
                </NavItem>
                <NavItem>
                    <Zone zoneName="SignIn" contentId={id} fixed />
                </NavItem>
            </Navigation>
        </Hidden>
    );
};

const secondaryNavigation: WidgetModule = {
    component: SecondaryNavigation,
    definition: {
        group: "Common",
        icon: "NavigationList",
        fieldDefinitions: [],
    },
};

export default secondaryNavigation;
