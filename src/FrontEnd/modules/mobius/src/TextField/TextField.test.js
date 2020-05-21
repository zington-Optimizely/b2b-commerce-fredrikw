import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../ThemeProvider';
import TextField from './TextField';
import DisablerContext from '../utilities/DisablerContext';

describe('TextField', () => {
    let props;
    let mountedWrapper;
    let disablerValue;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <DisablerContext.Provider value={disablerValue}>
                        <TextField {...props} />
                    </DisablerContext.Provider>
                </ThemeProvider>
            );
        }
        return mountedWrapper;
    };

    const unmountTextField = () => {
        mountedWrapper = undefined;
    };

    beforeEach(() => {
        props = {};
        unmountTextField();
    });

    test('renders the label when prop is provided', () => {
        props = { label: 'props.label' };
        const label = wrapper().find(TextField).find(TextField).find('label')
            .getDOMNode();
        expect(label.innerHTML).toBe(props.label);
    });

    test('adds an asterisk to the label when `required` is true, but not disabled', () => {
        const label = () => wrapper().find(TextField).find('label').getDOMNode();

        props = { label: 'props.label', required: true, disabled: false };
        expect(label().innerHTML).toBe(`${props.label} *`);

        unmountTextField();

        props = { label: 'props.label', required: true, disabled: true };
        expect(label().innerHTML).toBe(props.label);
    });

    test('renders the hint text when provided', () => {
        props = { hint: 'props.hint' };
        const hintText = wrapper().find(TextField).find('[id$="-description"] span').getDOMNode().innerHTML;

        expect(hintText).toBe(props.hint);
    });

    describe('is appropriately disabled', () => {
        test("if DisablerContext is true", () => {
            disablerValue = { disable: true };
            expect(wrapper().find("input").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is true", () => {
            props = { disabled: true };
            disablerValue = { disable: false };
            expect(wrapper().find("input").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is false", () => {
            disablerValue = { disable: false };
            expect(wrapper().find("input").prop("disabled")).toBe(false);
        });
    });
});
