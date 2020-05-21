import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import Select from './Select';
import ThemeProvider from '../ThemeProvider';
import DisablerContext from '../utilities/DisablerContext';

describe('Select', () => {
    let props;
    let mountedWrapper;
    let disablerValue;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <DisablerContext.Provider value={disablerValue}>
                        <Select {...props} />
                    </DisablerContext.Provider>
                </ThemeProvider>
            );
        }
        return mountedWrapper;
    };

    const unmountSelect = () => {
        mountedWrapper = undefined;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test('renders the label when prop is provided', () => {
        props = { label: 'props.label' };
        const label = wrapper().find(Select).find('label').getDOMNode();
        expect(label.innerHTML).toBe(props.label);
    });

    test('adds an asterisk to the label when `required` is true, but not disabled', () => {
        const label = () => wrapper().find(Select).find('label').getDOMNode();
        props = { label: 'props.label', required: true, disabled: false };
        expect(label().innerHTML).toBe(`${props.label} *`);

        unmountSelect();

        props = { label: 'props.label', required: true, disabled: true };
        expect(label().innerHTML).toBe(props.label);
    });

    test('renders the hint text when provided', () => {
        props = { hint: 'props.hint' };
        const hintText = wrapper().find(Select).find('[id$="-description"] span').getDOMNode().innerHTML;
        expect(hintText).toBe(props.hint);
    });

    describe('is appropriately disabled', () => {
        test("if DisablerContext is true", () => {
            disablerValue = { disable: true };
            expect(wrapper().find("select").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is true", () => {
            props = { disabled: true };
            disablerValue = { disable: false };
            expect(wrapper().find("select").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is false", () => {
            disablerValue = { disable: false };
            expect(wrapper().find("select").prop("disabled")).toBe(false);
        });
    });
});
