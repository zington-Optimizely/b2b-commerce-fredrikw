import * as React from "react";
import { checkboxSizes } from "../Checkbox";

const RadioGroupContext = React.createContext<{
    name?: string;
    onChange?: React.InputHTMLAttributes<HTMLInputElement>["onChange"];
    sizeVariant?: keyof typeof checkboxSizes;
    value?: string;
}>({});

export default RadioGroupContext;
