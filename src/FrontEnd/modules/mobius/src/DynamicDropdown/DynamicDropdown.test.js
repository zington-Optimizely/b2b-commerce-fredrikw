import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../ThemeProvider';
import DynamicDropdown, { Option } from './DynamicDropdown';
import ChevronDown from '../Icons/ChevronDown';
import Icon from '../Icon';
import Link from '../Link';
import LoadingSpinner from '../LoadingSpinner';
import Typography from '../Typography';
import FormField from '../FormField';
import { colors } from './optionsLists';

const generateOptions = valsArr => valsArr.map(val => ({ optionText: val }));
const colorOptions = generateOptions(colors);

const validateOptions = (root, options) => {
    const presentValues = {};
    root.find(Option).forEach((option) => {
        const value = option.getDOMNode().innerHTML;
        presentValues[value] = true;
    });
    options.forEach((c) => {
        expect(presentValues[c]).toBe(true);
    });
};

describe('DynamicDropdown', () => {
    let props = { options: colorOptions };
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <DynamicDropdown {...props} />
                </ThemeProvider>
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        mountedWrapper = undefined;
    });

    describe('component rendering', () => {
        test('displays a carat icon', () => {
            const root = wrapper();
            expect(root.find(Icon)).toHaveLength(1);
            expect(root.find(ChevronDown)).toHaveLength(1);
        });
        test('renders all options as passed', () => {
            const root = wrapper();
            root.find('input').simulate('click');
            validateOptions(root, colors);
        });
        test('renders moreOptions if provided', () => {
            props = { options: colorOptions, moreOption: <Link href="www.hat.com">more hats</Link> };
            const root = wrapper();
            root.find('input').simulate('click');
            expect(root.find(Link)).toHaveLength(1);
        });
        test('renders loading spinner if loading', () => {
            props = { options: colorOptions, isLoading: true };
            const root = wrapper();
            root.find('input').simulate('click');
            expect(root.find(LoadingSpinner)).toHaveLength(1);
        });
        test('is rendered as a `FormField`', () => {
            expect(wrapper().find(FormField)).toHaveLength(1);
        });
    });

    describe('functionality', () => {
        test('renders selected item as passed in initial props', () => {
            const selected = 'indigo';
            props = { options: colorOptions, selected };
            const root = wrapper();
            root.find('input').simulate('click');
            const selectedRow = root.find('div[value="indigo"]');
            expect(selectedRow).toHaveLength(1);
            expect(selectedRow.prop('aria-selected')).toBe(true);
            expect(selectedRow).toHaveStyleRule('background', '#275AA8');
            expect(selectedRow).toHaveStyleRule('color', '#FFFFFF');
        });
        test('displays \'no options\' result if no options from search', () => {
            const root = wrapper();
            root.find('input').simulate('change', { target: { value: 'm' } });
            const noOptions = root.find('div[data-id="no-options"]');
            expect(noOptions).toHaveLength(1);
        });
        test('displayed options change as typed input changes', () => {
            const optionArray = ['red', 'orangered', 'red-blue', 'red-purple', 'reddish'];
            props = { options: generateOptions(optionArray) };
            const root = wrapper();
            root.find('input').simulate('change', { target: { value: 'red' } });
            validateOptions(root, optionArray);
            root.find('input').simulate('change', { target: { value: 'red-' } });
            validateOptions(root, ['red-blue', 'red-purple']);
            root.find('input').simulate('change', { target: { value: 'redd' } });
            validateOptions(root, ['reddish']);
        });
        test('selected option is visible as non-placeholder text', () => {
            const selected = 'indigo';
            props = { options: colorOptions, selected };
            const root = wrapper();
            expect(root.find('input').prop('placeholder')).toBe('');
            expect(root.find(Typography).getDOMNode().innerHTML).toBe('indigo');
        });
        // test('displayed value changes if props change', () => {
        // });
        // test('placeholder does not display if selected option is present', () => {
        // });
        // describe('event handlers', () => {
        //     test('onSelectionChange is called on selection change', () => {
        //     });
        //     test('onInputChange is called on input change', () => {
        //     });
        //     test('onClose is called on close', () => {
        //     });
        //     test('onOpen is called on open', () => {
        //     });
        // });
    });

    describe('accessibility considerations', () => {
        describe('dom elements', () => {
            test('aria-expanded appropriate to expanded state', () => {
                const root = wrapper();
                expect(root.find('div[role="combobox"]').prop('aria-expanded')).toBe(false);
                root.find('input').simulate('click');
                expect(root.find('div[role="combobox"]').prop('aria-expanded')).toBe(true);
            });
            test('renders an input with role `searchbox`', () => {
                expect(wrapper().find('input').prop('role')).toBe('searchbox');
            });
            test('input wrapped in a `combobox` role', () => {
                expect(wrapper().find('[role="combobox"]').find('input')).toHaveLength(1);
            });
            test('list of options is ul with role `listbox`', () => {
                const root = wrapper();
                root.find('input').simulate('click');
                expect(root.find('ul').prop('role')).toBe('listbox');
            });
        });
        describe('keyboard interaction', () => {
        //     test('arrow key focuses options', () => {
        //     });
        //     test('enter selects item and closes select', () => {
        //     });
        //     describe('implicit selection', () => {
        //         test('if exact match and no selected item, enter selects', () => {
        //         });
        //         test('if exact match and no selected item, tab selects', () => {
        //         });
        //         test('if single non-disabled result and no selected item, tab selects', () => {
        //         });
        //         test('if single non-disabled result and no selected item, enter selects', () => {
        //         });
        //     });
        });
    });
});
