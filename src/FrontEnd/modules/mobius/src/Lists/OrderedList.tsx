import { getProp } from "@insite/mobius/utilities";
import styled from "styled-components";
import InjectableCss from "../utilities/InjectableCss";
import injectCss from "../utilities/injectCss";

export const OrderedList = styled.ol<InjectableCss>`
    padding: 0 0 0 40px;
    margin: 1rem 0;
    ${getProp("theme.lists.defaultProps.css")}
    ${getProp("theme.lists.orderedListProps.css")}
    ${injectCss}
`;

export default OrderedList;
