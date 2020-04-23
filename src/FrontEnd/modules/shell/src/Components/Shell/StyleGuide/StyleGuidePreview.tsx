import * as React from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import Accordion from "@insite/mobius/Accordion";
import AccordionSection from "@insite/mobius/AccordionSection";
import Breadcrumbs from "@insite/mobius/Breadcrumbs";
import Button from "@insite/mobius/Button";
import Checkbox from "@insite/mobius/Checkbox";
import CheckboxGroup from "@insite/mobius/CheckboxGroup";
import Clickable from "@insite/mobius/Clickable";
import DatePicker from "@insite/mobius/DatePicker";
import FileUpload from "@insite/mobius/FileUpload";
import Link from "@insite/mobius/Link";
import LoadingSpinner from "@insite/mobius/LoadingSpinner";
import OverflowMenu from "@insite/mobius/OverflowMenu";
import Pagination from "@insite/mobius/Pagination";
import Radio from "@insite/mobius/Radio";
import RadioGroup from "@insite/mobius/RadioGroup";
import Select from "@insite/mobius/Select";
import TextArea from "@insite/mobius/TextArea";
import TextField from "@insite/mobius/TextField";
import ThemeProvider from "@insite/mobius/ThemeProvider";
import Tag from "@insite/mobius/Tag";
import ToolTip from "@insite/mobius/Tooltip";
import Typography from "@insite/mobius/Typography";
import Stage from "@insite/shell/Components/Shell/Stage";
import StagePositioner from "@insite/shell/Components/Shell/StagePositioner";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import ShellState from "@insite/shell/Store/ShellState";
import { LoadStatus } from "@insite/shell/Store/StyleGuide/StyleGuideReducer";
import translate from "@insite/client-framework/Translate";

const mapStateToProps = (state: ShellState) => {
    const styleGuide = state.styleGuide;

    if (styleGuide.loadStatus !== LoadStatus.Loaded) {
        return styleGuide;
    }

    return {
        loadStatus: styleGuide.loadStatus,
        theme: styleGuide.theme,
    };
};

const ConnectableStyleGuidePreview: React.FunctionComponent<ReturnType<typeof mapStateToProps>> = props => {
    if (props.loadStatus !== LoadStatus.Loaded) {
        return <PreviewWrapper>
            <PreviewH1>Style Guide</PreviewH1>
            <PreviewP>Loading...</PreviewP>
        </PreviewWrapper>;
    }

    // Being from redux, the theme is frozen.
    // `ThemeProvider` wants to write the `translate` property, which is root-level, so a shallow clone allows this.
    const shallowClonedTheme = { ...props.theme };

    return <StagePositioner><Stage>
    <PreviewWrapper>
    <ThemeProvider theme={shallowClonedTheme} translate={translate}>
        <PreviewH1>Style Guide</PreviewH1>
        <PreviewP>
            This style guide allows you to quickly update all styles, colors, and components in one place.
            To view updates in context of your website content, view Site Styles on the design menu screen.
        </PreviewP>
        <PreviewH2>Colors</PreviewH2>
        <PreviewP>
            The storefront uses a range of default colors, which are based on a theme and can be changed within the CMS.
        </PreviewP>
        <ul>
            <ColorDemo caption="Primary" color={props.theme.colors.primary.main} contrast={props.theme.colors.primary.contrast} />
            <ColorDemo caption="Secondary" color={props.theme.colors.secondary.main} contrast={props.theme.colors.secondary.contrast} />
        </ul>
        <ul>
            <ColorDemo caption="Success" color={props.theme.colors.success.main} contrast={props.theme.colors.success.contrast} />
            <ColorDemo caption="Danger" color={props.theme.colors.danger.main} contrast={props.theme.colors.danger.contrast} />
            <ColorDemo caption="Warning" color={props.theme.colors.warning.main} contrast={props.theme.colors.warning.contrast} />
            <ColorDemo caption="Info" color={props.theme.colors.info.main} contrast={props.theme.colors.info.contrast} />
        </ul>
        <ul>
            <ColorDemo caption="Background" color={props.theme.colors.common.background} contrast={props.theme.colors.common.backgroundContrast} />
            <ColorDemo caption="Accent" color={props.theme.colors.common.accent} contrast={props.theme.colors.common.accentContrast} />
            <ColorDemo caption="Border" color={props.theme.colors.common.border} />
            <ColorDemo caption="Disabled" color={props.theme.colors.common.disabled} />
        </ul>
        <ul>
            <ColorDemo caption="Text Main" color={props.theme.colors.text.main} />
            <ColorDemo caption="Text Accent" color={props.theme.colors.text.accent} />
            <ColorDemo caption="Text Disabled" color={props.theme.colors.text.disabled} />
            <ColorDemo caption="Text Link" color={props.theme.colors.text.link} />
        </ul>
        <PreviewH2>Foundations</PreviewH2>
        <PreviewP>
            Foundations are the basic building blocks of this design system.
            They provide a basic set of configurable options to be used by components and widgets.
        </PreviewP>
        <Separator />
        <PreviewH3>Typography</PreviewH3>
        <PageStage>
            <Typography variant="h1" id="h1-preview">h1 Type Heading</Typography>
            <Typography variant="h2" id="h2-preview">h2 Type Heading</Typography>
            <Typography variant="h3" id="h3-preview">h3 Type Heading</Typography>
            <Typography variant="h4" id="h4-preview">h4 Type Heading</Typography>
            <Typography variant="h5" id="h5-preview">h5 Type Heading</Typography>
            <Typography variant="h6" id="h6-preview">h6 Type Heading</Typography>
            <Typography
                variant="legend"
                id="legend-preview"
                css={css`
                    padding-bottom: 10px;
                    display: inline-block;
                `}
            >Legend Text</Typography>
            <div><Typography
                    variant="headerPrimary"
                    id="headerPrimary-preview"
                css={css`
                    padding-bottom: 10px;
                    display: inline-block;
                `}
                >Header Primary Text</Typography>
            </div>
            <div><Typography
                variant="headerSecondary"
                id="headerSecondary-preview"
                css={css`
                    padding-bottom: 10px;
                    display: inline-block;
                `}
            >Header Secondary Text</Typography></div>
            <div><Typography
                variant="headerTertiary"
                id="headerTertiary-preview"
                css={css`
                    padding-bottom: 10px;
                    display: inline-block;
                `}
            >Header Tertiary Text</Typography></div>
            <div><Link
                css={css`
                    padding-bottom: 10px;
                    display: inline-block;
                `}
            >Link</Link></div>
            <Typography
                variant="body"
                as="p"
                id="body-preview"
                css={css` padding-bottom: 10px; `}
            >Body text - {loremIpsum}</Typography>
            <Typography variant="p" id="p-preview">Paragraph text - {loremIpsum}</Typography>
        </PageStage>
        <PreviewH2>Components</PreviewH2>
        <PreviewH3 id="accordion-preview">Accordion</PreviewH3>
        <PageStage>
            <Accordion headingLevel={2}>
                <AccordionSection title="Initially Expanded Section" expanded>
                    <Typography variant="p">Section text - {loremIpsum}</Typography>
                </AccordionSection>
                <AccordionSection title="Initially Closed Section 1">
                    <Typography variant="p">Section text - {loremIpsum}</Typography>
                    </AccordionSection>
                <AccordionSection title="Initially Closed Section 2">
                    <Typography variant="p">Section text - {loremIpsum}</Typography>
                </AccordionSection>
            </Accordion>
        </PageStage>
        <Separator />
        <PreviewH3 id="breadcrumb-preview">Breadcrumbs</PreviewH3>
        <PageStage>
            <Breadcrumbs links={breadCrumbLinks.slice(0, 2) as any} />
            <Breadcrumbs links={breadCrumbLinks.slice(0, 3) as any} />
            <Breadcrumbs links={breadCrumbLinks as any} />
        </PageStage>
        <Separator />
        <PreviewH3>
            {"Buttons "}
            <HeadingQualifier>(When designing your buttons you can specify type, shape, color, hover styling and more.)</HeadingQualifier>
        </PreviewH3>
        <PageStage>
            <ul>
                <ButtonDemoListItem>
                    <Button variant="primary" id="primary-button-preview">Primary Button</Button>
                </ButtonDemoListItem>
                <ButtonDemoListItem>
                    <Button variant="secondary" id="secondary-button-preview">Secondary Button</Button>
                </ButtonDemoListItem>
                <ButtonDemoListItem>
                    <Button variant="tertiary" id="tertiary-button-preview">Tertiary Button</Button>
                </ButtonDemoListItem>
            </ul>
        </PageStage>
        <Separator />
        <PreviewH3>Form Fields</PreviewH3>
        <PageStage>
            <div style={{ width: "400px" }}>
                <TextField label="Text Field" hint="Text field hint text" id="label-text-preview" /><Spacer/>
                <TextField
                    id="error-text"
                    label="Text Field With Error"
                    error="Text field has an error"
                    hint="Text field with error and hint text"
                /><Spacer/>
                <TextArea label="Text Area" /><Spacer/>
                <CheckboxGroup label="Check Box Group">
                    <Checkbox checked>Item 1</Checkbox>
                    <Checkbox>Item 2</Checkbox>
                </CheckboxGroup><Spacer/>
                <CheckboxGroup label="Check Box Disabled Group">
                    <Checkbox disabled checked>Item 1</Checkbox>
                    <Checkbox disabled>Item 2</Checkbox>
                </CheckboxGroup><Spacer/>
                <DatePicker label="Date Picker" /><Spacer/>
                <FileUpload label="File Upload" /><Spacer/>
                <RadioGroup label="Radio Group" value="Item 1">
                    <Radio>Item 1</Radio>
                    <Radio>Item 2</Radio>
                </RadioGroup><Spacer/>
                <RadioGroup label="Radio Group Disabled" value="Item 1">
                    <Radio disabled>Item 1</Radio>
                    <Radio disabled>Item 2</Radio>
                </RadioGroup><Spacer/>
                <Select
                    label="Select"
                    placeholder="Placeholder"
                    hint="Select hint text"
                >
                    <option value={0}>Placeholder</option>
                    <option value={1}>Item 1</option>
                    <option value={2}>Item 2</option>
                    <option value={3} disabled>Item 3</option>
                    <optgroup label="Option Group">
                        <option value={4}>Item 4</option>
                        <option value={5} disabled>Item 5</option>
                    </optgroup>
                    <optgroup label="Option Group Disabled" disabled>
                        <option value={6}>Item 6</option>
                        <option value={7} disabled>Item 7</option>
                    </optgroup>
                </Select><Spacer/>
            </div>
        </PageStage>
        <Separator />
        <PreviewH3>Loading Spinner</PreviewH3>
        <PageStage>
            <LoadingSpinner />
        </PageStage>
        <PreviewH3>Overflow Menu</PreviewH3>
        <PageStage>
            <OverflowMenu position="start">
                <Clickable>Item 1</Clickable>
                <Clickable>Item 2</Clickable>
            </OverflowMenu>
        </PageStage>
        <PreviewH3>Pagination</PreviewH3>
        <PageStage>
            <Pagination
                currentPage={1}
                onChangeResultsPerPage={() => {}}
                onChangePage={() => {}}
                resultsPerPage={10}
                resultsCount={45}
                resultsPerPageOptions={[5, 10, 20]}
            />
        </PageStage>
        <PreviewH3>Tag</PreviewH3>
        <PageStage>
            <Tag>Ordered before: 1/12/2019</Tag>
        </PageStage>
        <PreviewH3>Tool Tip</PreviewH3>
        <PageStage>
            <Typography>Information</Typography><ToolTip text={`${loremIpsum.slice(0, 39)}.`} />
        </PageStage>
    </ThemeProvider>
    </PreviewWrapper>
    </Stage></StagePositioner>;
};

const StyleGuidePreview = connect(mapStateToProps)(ConnectableStyleGuidePreview as any);

export default StyleGuidePreview;

const fontFamily = "\"Roboto Condensed\", sans-serif;";
const textColor = "#4a4a4a";
const textHighlight = "#78bc21";

const PreviewH1 = styled.h1`
    font-family: ${fontFamily};
    font-weight: 300;
    font-size: 32px;
    line-height: 38px;
    color: ${textHighlight};
    margin: 0 0 15px 0;
`;

const PreviewH2 = styled.h2`
    font-family: ${fontFamily};
    font-weight: bold;
    font-size: 24px;
    line-height: 28px;
    color: ${(props: ShellThemeProps) => props.theme.colors.common.accent};
    background: ${textHighlight};
    padding: 7px 10px 5px 7px;
    margin: 46px 0 22px;
`;

const PreviewH3 = styled.h3`
    font-family: ${fontFamily};
    font-size: 18px;
    line-height: 21px;
    color: ${textColor};
    margin: 33px 0 11.5px;
`;

const PreviewP = styled.p`
    font-family: ${fontFamily};
    font-weight: 300;
    font-size: 18px;
    line-height: 21px;
    color: #9b9b9b;
    margin-bottom: 33px;
`;

const PreviewWrapper = styled.div`
    padding: 53px;
`;

const ColorDemo = (props: {
    caption: React.ReactNode,
    color: string,
    contrast?: string;
}) => (<ColorDemoListItem>
    <ColorDemoItemWrapper>
        {props.contrast
            ? <SwatchWithContrast color={props.color} contrast={props.contrast || "rgba(255,255,255,0)"}>Contrast</SwatchWithContrast>
            : <Swatch color={props.color}>&nbsp;</Swatch>
        }
        <ColorDemoItemCaption>{props.caption}</ColorDemoItemCaption>
    </ColorDemoItemWrapper>
</ColorDemoListItem>);

const ColorDemoListItem = styled.li`
    display: inline-block;
`;

const ColorDemoItemWrapper = styled.figure`
    margin: 0 45px 20px 0;
`;

const SwatchInner = styled.span<{ color: string; }>`
    display: inline-block;
    width: 125px;
    height: 125px;
    border-radius: 8px;
    background-color: ${props => props.color};
`;

const SwatchOuter = styled.span`
    display: inline-block;
    width: 135px;
    height: 135px;
    border-radius: 12px;
    padding: 4px;
    border: 1px solid rgba(216, 216, 216, 0.65);
`;

const PageStage = styled.div`
    padding: 15px;
    background: ${props => props.theme.colors.common.background};
`;

const Swatch: React.FunctionComponent<{ color: string; }> = (props) => <SwatchOuter>
    <SwatchInner {...props} />
</SwatchOuter>;

const SwatchInnerWithContrast = styled(SwatchInner)<{ color: string; contrast: string; }>`
    color: ${props => props.contrast};
    padding: 10px;
`;

const SwatchWithContrast: React.FunctionComponent<{ color: string; contrast: string; }> = (props) => <SwatchOuter>
    <SwatchInnerWithContrast {...props} />
</SwatchOuter>;

const ColorDemoItemCaption = styled.figcaption`
    color: ${textColor};
    margin-top: 5px;
    font-weight: bold;
    font-family: ${fontFamily};
    font-size: 18px;
    line-height: 21px;
`;

const Separator = styled.hr`
    border: 1px solid #9b9b9b;
    opacity: 0.5;
    margin-top: 33px;
`;

const Spacer = styled.div`
    height: 20px;
`;

const loremIpsum
    = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, "
    + "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
    + "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris "
    + "nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in "
    + "reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
    + "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui "
    + "officia deserunt mollit anim id est laborum.";

const breadCrumbLinks = [{
    children: "Home",
    href: "",
}, {
    children: "Category",
    href: "",
}, {
    children: "Subcategory",
    href: "",
}, {
    children: "Current Page",
}] as const;

const HeadingQualifier = styled.span`
    font-weight: 300;
`;

const ButtonDemoListItem = styled.li`
    display: inline-block;
    margin-right: 10px;
`;
