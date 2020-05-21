import React from "react";
import styled, { css } from "styled-components";
import Icon from "@insite/mobius/Icon";
import Typography from "@insite/mobius/Typography";
import Checkbox from "@insite/mobius/Checkbox";
import TextField from "@insite/mobius/TextField";
import DynamicDropdown, { DynamicDropdownProps } from "@insite/mobius/DynamicDropdown";
import { FormFieldProps } from "@insite/mobius/FormField";
import iconsObject from "@insite/mobius/Icons/commonIcons";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";

const OptionRow = styled.div`
    display: flex;
    align-items: center;
`;

const IconSelector: React.FunctionComponent<Pick<DynamicDropdownProps, "onSelectionChange">
    & Partial<FormFieldProps>
    & {
        onTextFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
        value?: string;
    }
> = ({ value, ...otherProps }) => {
    /* eslint-disable no-prototype-builtins */
    const valueIsIconKey = value ? iconsObject.hasOwnProperty(value) : false;
    const [useDirectSource, setUseDirectSource] = React.useState(value ? !iconsObject.hasOwnProperty(value) : false);
    /* eslint-enable no-prototype-builtins */
    const textFieldProps = valueIsIconKey ? { } : { value };
    const options = Object.keys(iconsObject).map((iconKey) => {
        return {
            optionText: iconKey,
            optionValue: iconKey,
            rowChildren: (<OptionRow key={iconKey} >
                <Icon src={iconsObject[iconKey]}/>
                <Typography css={css` padding-left: 10px; `}>{iconKey}</Typography>
            </OptionRow>),
        };
    });

    return (<>
        {useDirectSource
            ? <TextField
                {...textFieldProps}
                {...omitMultiple(otherProps, ["onTextFieldChange", "onSelectionChange"] as const)}
                onChange={otherProps.onTextFieldChange}
                disabled={!useDirectSource}
            /> : <DynamicDropdown
                options={options}
                selected={value || ""}
                disabled={useDirectSource}
                {...otherProps}
            />
        }
        <Checkbox
            variant="toggle"
            labelPosition="right"
            checked={useDirectSource}
            onChange={() => setUseDirectSource(!useDirectSource)}
            css={css` margin-top: 10px; `}
        >
            Use direct source
        </Checkbox>
    </>);
};

export default IconSelector;
