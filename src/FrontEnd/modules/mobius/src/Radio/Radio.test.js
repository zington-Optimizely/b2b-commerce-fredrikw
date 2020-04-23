import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../ThemeProvider';
import RadioGroupContext from '../RadioGroup/RadioGroupContext';
import Radio from './Radio';

describe('Radio', () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <RadioGroupContext.Provider value={{
                        name: 'hat',
                        value: 'moose',
                        sizeVariant: 'small',
                        onChange: () => 'hat',
                    }}>
                        <Radio name="moose" value="moose" {...props} />
                    </RadioGroupContext.Provider>
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
        const root = wrapper().find(Radio).getDOMNode();
        expect(root instanceof HTMLDivElement).toBe(true);
    });
});
