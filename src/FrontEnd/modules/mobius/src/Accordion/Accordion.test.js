import 'jest-styled-components';
import React from 'react';
import { mount } from 'enzyme';
import ThemeProvider from '../ThemeProvider';
import Accordion from './Accordion';
import AccordionSection from '../AccordionSection';

describe('Accordion', () => {
    let props;
    let sectionProps;
    let mountedWrapper;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider>
                    <Accordion {...props}>
                        <AccordionSection {...sectionProps} />
                    </Accordion>
                </ThemeProvider>
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = { headingLevel: 1 };
        sectionProps = { title: 'title' };
        mountedWrapper = undefined;
    });

    test('renders as a dl by default', () => {
        const root = wrapper().find(Accordion).getDOMNode();
        expect(root instanceof HTMLDListElement).toBe(true);
    });
});
