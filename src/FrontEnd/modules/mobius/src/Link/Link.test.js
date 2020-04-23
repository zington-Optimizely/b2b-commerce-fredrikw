import 'babel-polyfill';
import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../ThemeProvider';
import Link from './Link';

describe('Link', () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Link {...props} />
                </ThemeProvider>
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test('renders a span by default', () => {
        const root = wrapper().find(Link).getDOMNode();
        expect(root instanceof HTMLSpanElement).toBe(true);
    });
});
