import { getProp } from "@insite/mobius/utilities";
import styled from "styled-components";
import InjectableCss from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";

export const UnorderedList = styled.ul<InjectableCss>`
    list-style: disc;
    padding: 0 0 0 40px;
    margin: 1rem 0;
    ${getProp("theme.lists.defaultProps.css")}
    ${getProp("theme.lists.unorderedListProps.css")}
    ${injectCss}
`;

export default UnorderedList;
