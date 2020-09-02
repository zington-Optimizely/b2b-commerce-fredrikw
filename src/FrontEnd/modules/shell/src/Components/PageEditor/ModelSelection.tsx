import DynamicDropdown, { OptionObject } from "@insite/mobius/DynamicDropdown/DynamicDropdown";
import { IconWrapper } from "@insite/mobius/Icon";
import * as React from "react";
import styled from "styled-components";

interface Props {
    modelType: string;
    selectedValue: string;
    onSelectionChange: (value?: string) => void;
    onInputChange: (value: string) => void;
    options: OptionObject[];
}

export class ModelSelection extends React.Component<Props> {
    private timer?: number;

    searchTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(this.timer);

        const value = event.currentTarget.value;
        this.setState({
            searchValue: value,
        });
        this.timer = setTimeout(() => {
            this.props.onInputChange(value);
        }, 50);
    };

    render() {
        return (
            <Wrapper>
                <DynamicDropdown
                    iconProps={{ size: 20 }}
                    labelPosition="left"
                    label={`Select ${this.props.modelType}`}
                    onSelectionChange={this.props.onSelectionChange}
                    onInputChange={this.searchTextChanged}
                    selected={this.props.selectedValue}
                    options={this.props.options}
                    hideNoOptionsIfEmptySearch
                ></DynamicDropdown>
            </Wrapper>
        );
    }
}

export const Wrapper = styled.div`
    margin-left: 20px;
    display: flex;
    align-items: center;
    white-space: nowrap;
    max-width: 50%;
    width: 400px;
    > div {
        margin-top: 0;
    }
    label {
        color: white;
        text-transform: none;
        padding: 6px 10px 0 0;
        font-weight: normal;
    }
    input {
        padding: 4px;
        height: 30px;
        width: 250px;
    }
    [role="combobox"] span:first-of-type {
        padding: 5px 12px;
    }
    ${IconWrapper} {
        padding: 0;
        border-radius: unset;
        background-color: transparent;
        height: 28px;
        width: 24px;
    }
    ul {
        top: 29px;
        border: none;
    }
`;
