import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../ThemeProvider';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Checkbox {...props} />
                </ThemeProvider>
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test('renders a div by default', () => {
        const root = wrapper().find(Checkbox).getDOMNode();
        expect(root instanceof HTMLDivElement).toBe(true);
    });
});
