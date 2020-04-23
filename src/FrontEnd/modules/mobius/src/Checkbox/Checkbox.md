### Example

```jsx
const css = require('styled-components').css;
const CheckboxGroup = require('../CheckboxGroup').default;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;
const Typography = require('../Typography').default;

<GridContainer>
    <GridItem width={[12,12,4,4,4]} css={css` display: block; `}>
        <Typography variant="h4">Default</Typography>
        <CheckboxGroup label="Checkbox Group Label">
            <Checkbox checked>Checked</Checkbox>
            <Checkbox>Unchecked</Checkbox>
            <Checkbox checked disabled>Disabled Checked</Checkbox>
            <Checkbox disabled>Disabled</Checkbox>
        </CheckboxGroup>
    </GridItem>
    <GridItem width={[12,12,4,4,4]} css={css` display: block; `}>
        <Typography variant="h4">Error</Typography>
        <CheckboxGroup label="Legal statement" required error="You must agree">
            <Checkbox error onChange={(e, value) => alert(value)}>
                I agree to the terms
            </Checkbox>
        </CheckboxGroup>
    </GridItem>
    <GridItem width={[12,12,4,4,4]} css={css` display: block; `}>
        <Typography variant="h4">Toggle Variant</Typography>
        <CheckboxGroup label="Toggle ">
            <Checkbox variant="toggle" checked>Checked</Checkbox>
            <Checkbox variant="toggle">Unchecked</Checkbox>
            <Checkbox variant="toggle" disabled>Disabled</Checkbox>
            <Checkbox variant="toggle" disabled checked>Disabled Checked</Checkbox>
        </CheckboxGroup>
    </GridItem>
</GridContainer>
```

### Smaller Size

```jsx
const css = require('styled-components').css;
const CheckboxGroup = require('../CheckboxGroup').default;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;
const Typography = require('../Typography').default;

<GridContainer>
    <GridItem width={[12,12,4,4,4]} css={css` display: block; `}>
        <Typography variant="h4">Default</Typography>
        <CheckboxGroup sizeVariant="small" label="Checkbox Group Label">
            <Checkbox checked>Checked</Checkbox>
            <Checkbox>Unchecked</Checkbox>
            <Checkbox checked disabled>Disabled Checked</Checkbox>
            <Checkbox disabled>Disabled</Checkbox>
        </CheckboxGroup>
    </GridItem>
    <GridItem width={[12,12,4,4,4]} css={css` display: block; `}>
        <Typography variant="h4">Error</Typography>
        <CheckboxGroup sizeVariant="small" label="Legal statement" required error="You must agree">
            <Checkbox error onChange={(e, value) => alert(value)}>
                I agree to the terms
            </Checkbox>
        </CheckboxGroup>
    </GridItem>
    <GridItem width={[12,12,4,4,4]} css={css` display: block; `}>
        <Typography variant="h4">Toggle Variant</Typography>
        <CheckboxGroup sizeVariant="small" label="Toggle ">
            <Checkbox variant="toggle" checked>Checked</Checkbox>
            <Checkbox variant="toggle">Unchecked</Checkbox>
            <Checkbox variant="toggle" disabled>Disabled</Checkbox>
            <Checkbox variant="toggle" disabled checked>Disabled Checked</Checkbox>
        </CheckboxGroup>
    </GridItem>
</GridContainer>
```

### Style Extensibility
Checkboxes being themed by the fieldSets defaults, as well as checkbox-specific defaults, with some component-specific overrides on top. 

```jsx
const CheckboxGroup = require('../CheckboxGroup').default;
const globalTheme = require('../globals/baseTheme').default;
const GridContainer = require('../GridContainer').default;
const GridItem = require('../GridItem').default;
const xIcon = require('../Icons/X').default;
const ThemeProvider = require('../ThemeProvider').default;

const theme={
    ...globalTheme,
    fieldSets: {
        defaultProps: {
            sizeVariant: 'default',
            color: 'primary'
        }
    },
    checkbox: {
        defaultProps: {
            iconProps: {src: xIcon},
            typographyProps: {weight: 300}
        }
    }
};

<ThemeProvider theme={theme}>
    <div style={{ width: 200 }}>
        <CheckboxGroup>
            <Checkbox checked>Themed with no instance overrides</Checkbox>
            <Checkbox checked labelPosition="left">Left Label</Checkbox>
            <Checkbox checked variant="toggle" labelPosition="right" iconProps>Toggle Right Label</Checkbox>
            <Checkbox color="warning" checked>Instance checkbox color</Checkbox>
            <Checkbox typographyProps={{weight: 'bold', underline: true}}>
                Instance text style
            </Checkbox>
            <Checkbox css={({ theme }) => `margin-left: -5px; border: 1px solid ${theme.colors.primary.main}; padding: 5px`}>
                Instance custom CSS (using styled-components function)
            </Checkbox>
        </CheckboxGroup>
    </div>
</ThemeProvider>
```

### Controlled Input

```jsx
const Button = require('../Button').default;
const Typography = require('../Typography').default;

const Spacer = () => <div style={{ width: 50 }} />;

class Example extends React.Component {
    constructor(props) {
        super(props);
        this.state = { checked: false };
        this.toggle = () => {
            this.setState(({checked}) => {
                return { checked: checked ? false : true };
            });
        };
        this.handleChange = (e, currentValue) => {
            this.setState({ checked: currentValue });
        };
    }

    render() {
        return (
            <div style={{ display: 'flex' }}>
                <Checkbox onChange={this.handleChange} checked={this.state.checked}>
                    Controlled Checkbox
                </Checkbox>
                <Spacer/>
                <Typography style={{ whiteSpace: 'nowrap', width: '180px' }}>Value: {this.state.checked ? 'checked' : 'unchecked'}</Typography>
                <Spacer/>
                <Button onClick={this.toggle}>Toggle</Button>
            </div>
        );
    }
}

<Example />
```
