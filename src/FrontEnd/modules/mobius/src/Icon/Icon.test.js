import 'babel-polyfill';
import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../ThemeProvider';
import Icon from './Icon';
import Activity from '../Icons/Activity';

describe('Icon', () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Icon {...props} />
                </ThemeProvider>
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test('returns null if src is falsey', () => {
        const root = wrapper().find(Icon).getDOMNode();
        expect(root).toBeNull();
    });

    test('returns a span if a component is passed into src', () => {
        props = { src: Activity };
        const root = wrapper().find(Icon).getDOMNode();
        expect(root instanceof HTMLSpanElement).toBe(true);
    });

    test('returns a span if a url is passed into src', () => {
        props = { src: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' };
        const root = wrapper().find(Icon).getDOMNode();
        expect(root instanceof HTMLSpanElement).toBe(true);
    });
});
