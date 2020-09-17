import { TextFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import { ContentItemFieldProps } from "@insite/shell/Components/ItemEditor/FieldsEditor";
import * as React from "react";
import styled from "styled-components";

const HorizontalRule: React.FC<ContentItemFieldProps<string, TextFieldDefinition>> = props => {
    return <HR />;
};

export default HorizontalRule;

const HR = styled.hr`
    margin: 24px 0;
    border: 1px solid rgba(74, 74, 74, 0.2);
`;
