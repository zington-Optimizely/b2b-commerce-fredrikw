import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../ThemeProvider';
import Clickable from './Clickable';

describe('Clickable', () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Clickable {...props} />
                </ThemeProvider>
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test('renders null if no children are provided', () => {
        const root = wrapper().find(Clickable).getDOMNode();
        expect(root).toBeNull();
    });

    test('renders a styled span if no href or onClick are provided', () => {
        props = { children: <canvas/> };
        const root = wrapper().find(Clickable).getDOMNode();
        expect(root).toBeInstanceOf(HTMLSpanElement);
    });

    test('renders an anchor when an href is provided, regardless of onClick', () => {
        props = {
            children: 'children',
            href: 'https://insitesoft.com',
            onClick: () => null,
        };
        const root = wrapper().find(Clickable).getDOMNode();
        expect(root).toBeInstanceOf(HTMLAnchorElement);
    });

    test('renders a button when an onClick is provided, but no href', () => {
        props.children = 'children';
        props.onClick = () => {return null;};
        const root = wrapper().find(Clickable).getDOMNode();
        expect(root).toBeInstanceOf(HTMLButtonElement);
    });

    test('calls the onClick function when the component is clicked', () => {
        const fn = jest.fn();
        props = {
            children: 'children',
            onClick: fn,
        };
        wrapper().find(Clickable).simulate('click');
        expect(fn).toHaveBeenCalled();
    });
});
