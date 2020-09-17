import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import * as React from "react";
import styled from "styled-components";

interface Props extends HasShellContext {
    type: string;
    isWidget: boolean;
}

const MissingComponentStyle = styled.div`
    color: red;
`;

const MissingComponent: React.FunctionComponent<Props> = props => {
    if (props.shellContext.isInShell) {
        return (
            <MissingComponentStyle>
                There was no {props.isWidget ? "widget" : "page"} found for {props.type}
            </MissingComponentStyle>
        );
    }

    return null;
};

export default withIsInShell(MissingComponent);
