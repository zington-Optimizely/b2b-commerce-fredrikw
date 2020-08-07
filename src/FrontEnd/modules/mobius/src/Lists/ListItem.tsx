import { getProp } from "@insite/mobius/utilities";
import styled from "styled-components";
import InjectableCss from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";

const ListItem = styled.li<InjectableCss>`
    ${getProp("theme.lists.defaultProps.css")}
    ${getProp("theme.lists.listItemProps.css")}
    ${injectCss}
`;

export default ListItem;
