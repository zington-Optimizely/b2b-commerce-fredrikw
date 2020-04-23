import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../ThemeProvider';
import TextField from './TextField';

describe('TextField', () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <TextField {...props} />
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
});
