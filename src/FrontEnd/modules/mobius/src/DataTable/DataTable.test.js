import DataTable from "@insite/mobius/DataTable/DataTable";
import baseTheme from "@insite/mobius/globals/baseTheme";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import { mount } from "enzyme";
import "jest-styled-components";
import React from "react";
import { css } from "styled-components";

const themeGenerator = newProps => ({
    ...baseTheme,
    dataTable: { ...baseTheme.dataTable, ...newProps },
});

describe("DataTable", () => {
    let props;
    let mountedWrapper;
    let theme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <DataTable {...props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        props = {
            /* prop: undefined */
        };
        mountedWrapper = undefined;
        theme = { ...baseTheme };
    });

    test("renders as a table by default", () => {
        const root = wrapper().find(DataTable).getDOMNode();
        expect(root instanceof HTMLTableElement).toBe(true);
    });

    describe("applies styling based on props and default", () => {
        describe("props with default", () => {
            test("instance css overrides default css by default", () => {
                props = {
                    css: css`
                        border: 1px solid lime;
                    `,
                };
                theme = themeGenerator({
                    defaultProps: {
                        css: css`
                            width: 50%;
                        `,
                    },
                });
                const root = wrapper().find("table");
                expect(root).not.toHaveStyleRule("width", "50%");
                expect(root).toHaveStyleRule("border", "1px solid lime");
            });
            test("instance css overrides default css when instance mergeCss is false, even if default mergeCss is true", () => {
                props = {
                    css: css`
                        border: 1px solid lime;
                    `,
                    mergeCss: false,
                };
                theme = themeGenerator({
                    defaultProps: {
                        css: css`
                            width: 50%;
                        `,
                        mergeCss: true,
                    },
                });
                const root = wrapper().find("table");
                expect(root).not.toHaveStyleRule("width", "50%");
                expect(root).toHaveStyleRule("border", "1px solid lime");
            });
            test("merges prop and variant css when mergeCss is true", () => {
                props = {
                    css: css`
                        border: 1px solid lime;
                    `,
                    mergeCss: true,
                };
                theme = themeGenerator({
                    defaultProps: {
                        css: css`
                            width: 50%;
                        `,
                    },
                });
                const root = wrapper().find("table");
                expect(root).toHaveStyleRule("width", "50%");
                expect(root).toHaveStyleRule("border", "1px solid lime");
            });
        });
    });
});

describe("Multiple DataTables", () => {
    let dataTable1Props;
    let dataTable2Props;
    let mountedWrapper;
    let theme;
    const wrapper = () => {
        if (!mountedWrapper) {
            mountedWrapper = mount(
                <ThemeProvider theme={theme}>
                    <DataTable id="dataTable1" {...dataTable1Props} />
                    <DataTable id="dataTable2" {...dataTable2Props} />
                </ThemeProvider>,
            );
        }
        return mountedWrapper;
    };

    beforeEach(() => {
        dataTable1Props = {
            /* prop: undefined */
        };
        dataTable2Props = {
            /* prop: undefined */
        };
        mountedWrapper = undefined;
        theme = { ...baseTheme };
    });

    describe("applies styling based on props and default", () => {
        describe("props with default", () => {
            test("merges instance and variant css for all instances when default mergeCss is true", () => {
                dataTable1Props = {
                    css: css`
                        border: 1px solid lime;
                    `,
                };
                dataTable2Props = {
                    css: css`
                        border: 2px dashed orange;
                    `,
                };
                theme = themeGenerator({
                    defaultProps: {
                        css: css`
                            width: 50%;
                        `,
                        mergeCss: true,
                    },
                });
                const dataTable1 = wrapper().find("#dataTable1");
                const dataTable2 = wrapper().find("#dataTable2");
                expect(dataTable1).toHaveStyleRule("width", "50%");
                expect(dataTable1).toHaveStyleRule("border", "1px solid lime");
                expect(dataTable2).toHaveStyleRule("width", "50%");
                expect(dataTable2).toHaveStyleRule("border", "2px dashed orange");
            });
        });
    });
});
