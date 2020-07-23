import getColor from "@insite/mobius/utilities/getColor";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface OwnProps {
}

const mapStateToProps = (state: ShellState) => ({
    homePageId: state.shellContext.homePageId,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps> & RouteComponentProps;

const MainNavigation = (props: Props) => {
    const url = props.location.pathname.toLowerCase();

    const link = (to: string, title: string, toCheck?: string) => {
        const isActive = url.startsWith((toCheck || to).toLowerCase());
        return <NavigationLink to={to} data-active={isActive}>{title}</NavigationLink>;
    };

    return <NavigationWrapper>
        {link(`/ContentAdmin/Page${props.homePageId}`, "Pages", "/ContentAdmin/Page")}
        {link("/ContentAdmin/Design/StyleGuide", "Style Guide")}
        {link("/ContentAdmin/About", "About")}
    </NavigationWrapper>;
};


export default connect(mapStateToProps)(withRouter(MainNavigation));

const NavigationWrapper = styled.div`
    height: ${(props: ShellThemeProps) => props.theme.headerHeight};
    display: flex;
    padding: 0 36px;
    align-items: flex-end;
`;

const NavigationLink = styled(Link)`
    margin-right: 16px;
    font-size: 18px;
    border-bottom: 2px solid transparent;

    &[data-active="true"] {
        color: ${getColor("primary.main")};
        border-bottom: 2px solid ${getColor("primary.main")};
    }
`;
