# Changelog

- Accessibility improvements: 
    - `RadioGroup` and `CheckboxGroup` will not render fieldsets with only one radio or checkbox
    - `Tooltip` accepts a prop named `triggerAltText` and includes it as alt text for the trigger icon if not provided. 
    - `DatePicker` buttons provide alt text
    - `FileUpload` is more keyboard friendly and only provides one label. 
    - Modify base theme for higher contrast.
    - `TextField` accepts a `clickableText` prop that renders a visually hidden text to describe the clickable. 
    
`Link` - iconProps was moved to icon property of Link.
`Toast` - body parameter type was changed to 'React.ReactNode' to have ability to pass siteMessage (which return 'React.ReactNode' type).
`Menu` - focuses on adjacent element when item in menu is clicked, to close menu while still using CSS-based appearance.
`CheckBoxGroup` - modified `onChange` type into to `onChangeHandler` 

## 1.0.0-beta.3

**Breaking changes**
- Refactoring the app-controlling elements of the `Modal` component into a generic `Overlay` component, including renaming `overlay` within `Modal` to `scrim` in `cssOverrides`, props (`closeOnScrimClick`) and componentry. 
- `TokenXFrame` has been renamed `TokenExFrame` to reflect the accurate name of the service.
- Removed `RelativeLink` and refactored how `Clickable` and `Link` interact. Link is now opt-out for SPA routing on relative links. 
- Full refactor of `DatePicker` to use `react-datetime-picker` instead of `react-day-picker`.

**New Components**
- `PanelMenu`
- `CascadingMenu`
- `Drawer`
- `Popover` - utility component
- `Overlay` - utility component
- `Tag`

**Improvements**
- `DataTable` now uniformly implements wrapping strings in `Typography` and accepts themable typography props for header and cells.
- `Button` now only wraps children in typography if those children are strings. 
- `Pagination` component now accepts a `currentPageButtonVariant` prop to determine the visual styles applied to the button denoting the current page. 
- `FormField` components now accepts a `backgroundColor` prop to determine the color of the form field's background and field icon background. 
- `LazyImage` component now provides a better experience when the image fails to load. 
- Upgraded to `react-styleguidist` v^10.6.2.
- `GridItem` modified so that it doesn't use the border for padding.
- Modified implementation of font import. Due to this change, imported fonts do not take effect in the live styleguide, however they will take effect in the application. 

## 1.0.0-beta.2

**Breaking changes**
- All `size` properties on components that accepted non-numeric values (e.g. 'small', 'medium', 'large'), have been renamed `sizeVariant`. Affected components include: 
    - `Button`
    - `Modal`
    - `FormField` - `TextField`, `TextArea`, `DatePicker`, `FileUpload`, `Select`, `DynamicDropdown`, & `TokenExFrame`
    - `FieldSet` - `Radio`, & `Checkbox`
- Conversion to typescript and concomitant clarification of type definitions may cause formerly silent typing issues to produce errors.
- All `css` and `cssOverrides` only accept the styled-components `css` helper. 

**New Components**
- Dynamic Dropdown [demo](https://insitesoftware.github.io/insite-commerce/#!/DynamicDropdown) which is a type of `FormField`.
- Toggle [demo](https://insitesoftware.github.io/insite-commerce/#!/Checkbox), which is a variant of `Checkbox`.

**Improvements**
- `FormField` accepts `labelId` to apply to label for use in `aria-labelledby`.
- `DatePicker` `onChange` prop documented and tested. `DatePicker` can be fully controlled.
- Styling changes on `Radio`.
- Helper functions are documented in the [Styleguide](https://insitesoftware.github.io/insite-commerce/#section-helper-functions).
- Disabled `FormField`s look disabled.
- Introduced three Header `Typography` variants: `headerPrimary`, `headerSecondary`, and `headerTertiary`.
- Allow `DataTable` to be themable via `cssOverride` object.
- `TextField` will render a clickable icon when passed a `clickableProps` prop.
- `Clickable` now prefers rendering a `Link` rather than rendering a `Button`. This provides value for SEO and accessibility. The existing behavior of `onClick` execution followed by `href` navigation is maintained when both are present.
- `Checkbox` receives size by default from `CheckboxGroup`.
- Upgraded to `react-styleguidist` v9.1.16

## 1.0.0-beta.1

**Breaking changes**
- `Typography` variants no longer accept pseudo-jss style objects, but props objects including a CSS override that can contain JSS.
- Meaningful re-write of theme shadows and colors to provide a more semantic-based theming API. When used consistently, colors now allow for robust theming, as demonstrated in the [Second ThemeProvider Demo](https://insitesoftware.github.io/insite-commerce/#!/ThemeProvider/3).
- Upgraded Styleguidist to version 9.
- Meaningful changes to the `Pagination` component, including:
    - 1-based numbering rather than 0-based, to allow for consistency with InsiteCommerce APIs.
    - Styling changes for consistency and improved customizability.
- `Pagination`, `DatePicker`, `TextField`, `Select` and `TokenExFrame` accept `iconProps` instead of `iconSrc`.
- `ThemeProvider` component no longer defaults to providing global default styles, but accepts two props, `createGlobalStyle` and `createChildGlobals` to govern creation of global styles and child styles for typography and css resets. This allows for multiple themes to coexist while providing a mechanism to explicitly apply styles to the `body`.
- `Button` theme object `defaultProps` removed in lieu of explicitly setting properties on each theme `Button` variant.
- `Button` when passed an icon will only apply button styles to an icon when passed as a `ButtonIcon`.
- Various typescript definition modifications.

**New components**
- Text Area input [demo](https://insitesoftware.github.io/insite-commerce/#!/TextArea)
- Overflow Menu [demo](https://insitesoftware.github.io/insite-commerce/#!/OverflowMenu)
- File Upload input [demo](https://insitesoftware.github.io/insite-commerce/#!/FileUpload)
- Toast (and Toaster) [demo](https://insitesoftware.github.io/insite-commerce/#!/Toast)
- TokenExFrame [demo](https://insitesoftware.github.io/insite-commerce/#!/TokenExFrame)

**Improvements**
- `Typography` component can accept a font family, and font family can be imported globally, as demonstrated in the [First ThemeProvider Demo](https://insitesoftware.github.io/insite-commerce/#!/ThemeProvider/1).
- `FormField`s (`TextField`, `TextArea`, `DatePicker`, `FileUpload`, `Select`, & `TokenExFrame`):
    - Now accept a `labelPosition="left"` prop that allows the label to display to the left of the FormField.
- `FieldSet`s (`Checkbox`, `Radio`):
    - Accept and render errors consistently.
- Both `FieldSet`s and `FormField`s:
    - Now accept any node as a `label`, `error` and `hint`, so that links, tooltips, etc can be included in these areas.
    - Are styled consistently out of the box when it comes to `label`, `hint` and `error`.
- Tertiary `Button` variant.
- `Radio` component displays correctly in Safari. 
- Tests pass!
- A subset of Icons can be viewed in the Style Guide.
- Focus object from theme is now being used to style every focusable element in Mobius.
- `Breadcrumb` link does not override theme link properties.
- Default theme provides `FormFields` border style `rectangle` instead of `underline`. 
- `OverflowMenu` transition improvement
- Components with internal `Typography` components which accept `typographyProps` objects via theme or prop will now accept variants and logically apply variant properties in a cascade.   

## 1.0.0-beta.0

Let there be Mobius.
