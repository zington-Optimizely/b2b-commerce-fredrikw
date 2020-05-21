import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../ThemeProvider';
import TextArea from './TextArea';
import DisablerContext from '../utilities/DisablerContext';

describe('TextArea', () => {
    let props;
    let mountedWrapper;
    let disablerValue;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <DisablerContext.Provider value={disablerValue}>
                        <TextArea {...props} />
                    </DisablerContext.Provider>
                </ThemeProvider>
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test('render a textarea', () => {
        expect(wrapper().find('textarea')).toHaveLength(1);
    });

    describe('is appropriately disabled', () => {
        test("if DisablerContext is true", () => {
            disablerValue = { disable: true };
            expect(wrapper().find("textarea").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is true", () => {
            props = { disabled: true };
            disablerValue = { disable: false };
            expect(wrapper().find("textarea").prop("disabled")).toBe(true);
        });
        test("if DisablerContext is false and disabled is false", () => {
            disablerValue = { disable: false };
            expect(wrapper().find("textarea").prop("disabled")).toBe(false);
        });
    });
});
