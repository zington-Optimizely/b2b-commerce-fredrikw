import * as React from "react";
import { match } from "react-router-dom";
import styled from "styled-components";
import HeaderBar from "@insite/shell/Components/Shell/HeaderBar";
import { Switcher } from "@insite/shell/Components/Shell/Switcher";

const MainHeader: React.FunctionComponent<{ match?: match, disabled?: boolean }> = ({ disabled, match }) => {
    return (<>
        <MainHeaderStyle>
            <HeaderBarStyle>
                <HeaderBar disabled={disabled}/>
            </HeaderBarStyle>
            <Switcher disabled={disabled}/>
        </MainHeaderStyle>
    </>);
};

export default MainHeader;

const MainHeaderStyle = styled.div`
    height: ${({ theme }) => theme.headerHeight};
    display: flex;
    flex-wrap: wrap;
    margin-bottom: -2px;
`;

const HeaderBarStyle = styled.div`
    display: flex;
    flex-grow: 1;
`;
