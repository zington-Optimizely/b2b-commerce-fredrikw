import { mount } from 'enzyme';
import 'jest-styled-components';
import React from 'react';
import Button from '../Button';
import Clickable from '../Clickable';
import baseTheme from '../globals/baseTheme';
import Icon from '../Icon';
import OverflowMenu from './OverflowMenu';
import ThemeProvider from '../ThemeProvider';

const generateChild = name => (<Clickable key={name}>{name}</Clickable>);
const children = [generateChild('title'), generateChild('moose')];
const propsBase = { isOpen: true, children };
const themeGenerator = defaultProps => ({
    ...baseTheme, overflowMenu: { defaultProps },
});

describe('OverflowMenu', () => {
    let props;
    let theme;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <p id="hi">hi</p>
                    <OverflowMenu {...props} />
                </ThemeProvider>
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = propsBase;
        theme = baseTheme;
        mountedWrapper = undefined;
    });

    describe('render html elements', () => {
        test('only renders a button and nav by default if open false', () => {
            props = { isOpen: false, children };
            const root = wrapper();
            expect(root.find(Button)).toHaveLength(1);
            expect(root.find('nav')).toHaveLength(1);
            expect(root.find('ul')).toHaveLength(0);
        });
        test('a nav and button if open true', () => {
            const root = wrapper().find('nav');
            expect(root.find(Button)).toHaveLength(1);
            expect(root).toHaveLength(1);
        });
        test('a ul by default', () => {
            const root = wrapper().find('ul');
            expect(root).toHaveLength(1);
        });
        test('an li for each child node', () => {
            const root = wrapper().find('li');
            expect(root).toHaveLength(2);
        });
        test('a Clickable for each child node', () => {
            const root = wrapper().find(Clickable);
            expect(root).toHaveLength(2);
        });
    });

    describe('expected behavior', () => {
        test('opens when trigger clicked', () => {
            props = { isOpen: false, children };
            const root = wrapper();
            expect(root.find('ul')).toHaveLength(0);
            root.find(Icon).simulate('click');
            expect(root.find(Button)).toHaveLength(1);
            expect(root.find('nav')).toHaveLength(1);
            expect(root.find('ul')).toHaveLength(1);
        });
        test('closes when esc pressed', () => {
            props = { isOpen: false, children };
            const root = wrapper();
            root.simulate('keyDown', {
                keyCode: 27,
                which: 27,
                key: 'escape',
            });
            expect(root.find('nav')).toHaveLength(1);
            expect(root.find('ul')).toHaveLength(0);
        });
        test('closes when other element clicked', () => {
            const root = wrapper();
            expect(root.find('ul')).toHaveLength(1);
            root.find('[id="hi"]').simulate('click');
            setTimeout(() => {
                expect(root.find('ul')).toHaveLength(0);
            }, 200);
        });
        test('menu item onclick called and menu closed when clicked', () => {
            const fn = jest.fn();
            props = {
                isOpen: false,
                children: [
                    <Clickable key="hat" id="hat" onClick={fn}>hat</Clickable>,
                    <Clickable key="moose" id="moose">moose</Clickable>,
                ],
            };
            const root = wrapper();
            root.find(Icon).simulate('click');
            expect(root.find('ul')).toHaveLength(1);
            root.find('button[id="hat"]').simulate('click');
            expect(fn).toHaveBeenCalled();
            setTimeout(() => {
                expect(root.find('ul')).toHaveLength(0);
            }, 200);
        });
    });

    describe('appropriately applies theme overrides', () => {
        describe('css overrides', () => {
            test('instance with no theme applies instance', () => {
                props = {
                    ...propsBase,
                    cssOverrides: {
                        wrapper: 'background: red;',
                    },
                };
                expect(wrapper().find('nav')).toHaveStyleRule('background', 'red');
            });
            test('theme with no instance applies theme', () => {
                theme = themeGenerator({ cssOverrides: { menu: 'color: azure;' } });
                expect(wrapper().find('ul')).toHaveStyleRule('color', 'azure');
            });
            test('theme and instance applies instance', () => {
                props = {
                    ...propsBase,
                    cssOverrides: {
                        menu: 'border: 1px dashed deeppink',
                        wrapper: 'color: red;',
                    },
                };
                theme = themeGenerator({ cssOverrides: { wrapper: 'color: blue;' } });
                const root = wrapper();
                expect(root.find('ul')).toHaveStyleRule('border', '1px dashed deeppink');
                expect(root.find('nav')).not.toHaveStyleRule('color', 'blue');
                expect(root.find('nav')).toHaveStyleRule('color', 'red');
            });
        });
        describe('buttonProps', () => {
            test('instance with no theme applies instance', () => {
                props = {
                    ...propsBase,
                    buttonProps: {
                        shadow: true,
                    },
                };
                expect(wrapper().find(Button)).toHaveStyleRule('box-shadow', baseTheme.shadows[1]);
            });
            test('theme with no instance applies theme', () => {
                theme = themeGenerator({ buttonProps: { variant: 'primary' } });
                expect(wrapper().find(Button)).toHaveStyleRule('color', '#FFFFFF');
            });
            test('theme and instance applies instance', () => {
                theme = themeGenerator({ buttonProps: { shape: 'rounded', sizeVariant: 'medium' } });
                props = {
                    ...propsBase,
                    buttonProps: {
                        sizeVariant: 'large',
                    },
                };
                const root = wrapper().find(Button);
                expect(root).toHaveStyleRule('height', '48px');
                expect(root).not.toHaveStyleRule('height', '40px');
                expect(root).toHaveStyleRule('border-radius', '.5em');
            });
        });
    });
});
