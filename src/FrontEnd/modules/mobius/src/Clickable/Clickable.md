### Example

```jsx
const Icon = require('../Icon').default;
const Search = require('../Icons/Search').default;

const style = { marginLeft: 20 };

<section style={{ display: 'flex' }}>
    <span>Not clickable</span>
    <Clickable onClick={() => alert('clicked!')} style={style}>
        <span>OnClick</span>
    </Clickable>
    <Clickable href="https://www.insitesoft.com" target="_blank" style={style}>
        <span>href</span>
    </Clickable>
    <Clickable href="https://www.insitesoft.com" target="_blank" onClick={() => alert('clicked!')} style={style}>
        <span>OnClick &amp; href</span>
    </Clickable>
    <Clickable onClick={() => alert('clicked!')} aria-label="Emoji example" style={style}>
        <Icon src={Search} />
    </Clickable>
</section>
```

### Extensibility
The clickable component can be extended on an instance basis as well as by theme. The theme surfaces a `focus` object through which 
focus outline attributes can be set, as well as a `defaultProps` object for the Clickable component.  

```jsx
const css = require('styled-components').css
const ThemeProvider = require('../ThemeProvider').default;

const style = { marginLeft: 20 };

<section style={{ display: 'flex' }}>

    <ThemeProvider theme={{focus: {color: 'grey', style: 'dashed', width: '1px'}}}>
        <Clickable onClick={() => {}}>
            <span>Themed with focus object</span>
        </Clickable>
    </ThemeProvider>
    <ThemeProvider theme={{clickable: { defaultProps: {css: css` &:hover {
        background-color: azure;
    } `}}}}>
        <Clickable onClick={() => {}} style={style}>
            <span>Themed with default CSS </span>
        </Clickable>
    </ThemeProvider>
    <Clickable onClick={() => {}} style={style} css={css`
        border: 1px solid transparent;
        border-bottom: 1px solid red;
        transition: all .2s ease-in-out;
        &:focus {
            border: 1px solid red;
            outline: none;
        }
        &:hover {
            color: red;
        }
    `}>
        <span>Instance overrides</span>
    </Clickable>
</section>
```
