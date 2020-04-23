import React from "react";
import styled, { css } from "styled-components";
import Icon from "@insite/mobius/Icon";
import Typography from "@insite/mobius/Typography";
import DynamicDropdown, { DynamicDropdownProps } from "@insite/mobius/DynamicDropdown";
import iconsObject from "@insite/mobius/Icons/commonIcons";

const OptionRow = styled.div`
    display: flex;
    align-items: center;
`;

const IconSelector: React.FunctionComponent<DynamicDropdownProps & { value?: string }> = ({ value, ...otherProps }) => {
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

    return (<DynamicDropdown
        options={options}
        selected={value || ""}
        {...otherProps}
    />);
};

export default IconSelector;
