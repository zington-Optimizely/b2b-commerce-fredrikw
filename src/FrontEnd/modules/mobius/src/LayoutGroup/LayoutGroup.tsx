import * as React from "react";
import LayoutGroupContext from "./LayoutGroupContext";
import { StyledProp } from "../utilities/InjectableCss";

export interface LayoutGroupProps {
    /** Order of appearance of this LayoutGroup within its parent LayoutTable. */
    index: number;
    /** CSS string or styled-components function to be injected into this component. */
    css?: StyledProp<LayoutGroupProps>;
}

/**
 * LayoutTable equivalent to a `<tr>` in an HTML table, but LayoutGroups can also be arranged as columns.
 */
const LayoutGroup: React.FC<LayoutGroupProps> = ({ children, index }) => (
    <LayoutGroupContext.Provider value={{ groupIndex: index }}>
        {children}
    </LayoutGroupContext.Provider>
);

/** @component */
export default LayoutGroup;
