import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../ThemeProvider';
import TokenExFrame from './TokenExFrame';
import CreditCard from '../Icons/CreditCard';

describe('TokenExFrame', () => {
    let props = { tokenExIFrameContainer: <iframe /> };
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <TokenExFrame {...props} />
                </ThemeProvider>
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    test('displays an icon when provided', () => {
        props = { iconProps: { src: CreditCard }, tokenExIFrameContainer: <iframe /> };
        expect(wrapper().find(CreditCard)).toHaveLength(1);
    });

    test('renders an input when disabled', () => {
        props = { disabled: true, tokenExIFrameContainer: <iframe /> };
        expect(wrapper().find('input')).toHaveLength(1);
    });

    describe('renders a div of the appropriate height', () => {
        test('when small', () => {
            props = { sizeVariant: 'small', tokenExIFrameContainer: <iframe /> };
            expect(wrapper().find('[data-id="frame-wrapper"]')).toHaveStyleRule('height', '30px');
        });
        test('when default', () => {
            props = { sizeVariant: 'default', tokenExIFrameContainer: <iframe /> };
            expect(wrapper().find('[data-id="frame-wrapper"]')).toHaveStyleRule('height', '40px');
        });
    });
});
