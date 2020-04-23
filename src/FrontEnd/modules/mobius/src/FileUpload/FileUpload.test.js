import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../ThemeProvider';
import FileUpload from './FileUpload';
import Icon from '../Icon';

describe('FileUpload', () => {
    let props;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <FileUpload {...props} />
                </ThemeProvider>
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {};
        mountedWrapper = undefined;
    });

    describe('render html elements', () => {
        test('file input field with icon', () => {
            const root = wrapper();
            expect(root.find('input')).toHaveLength(2);
            expect(root.find(Icon)).toHaveLength(1);
        });
        test('file input label if enabled', () => {
            expect(wrapper().find('label')).toHaveLength(1);
        });
        test('file input button if disabled', () => {
            props = { disabled: true };
            expect(wrapper().find('button')).toHaveLength(1);
        });
    });

    describe('functionality', () => {
        test('calls onChange when file is changed', () => {
            const fn = jest.fn();
            props = { onFileChange: fn, inputId: 'hat' };
            const file = new File(['(⌐□_□)'], 'chucknorris.png', {
                type: 'image/png',
            });
            const root = wrapper();
            root.find('input').first().simulate('change', { target: { files: [file] } });
            expect(fn).toHaveBeenCalled();
        });
        test('displays name of file when added', () => {
            const fn = jest.fn();
            props = { onFileChange: fn, inputId: 'hat' };
            const file = new File(['(⌐□_□)'], 'chucknorris.png', {
                type: 'image/png',
            });
            const root = wrapper();
            root.find('input').first().simulate('change', { target: { files: [file] } });
            expect(root.find('input[data-id="visualInput"]').prop('value')).toEqual('chucknorris.png');
        });
    });
});
