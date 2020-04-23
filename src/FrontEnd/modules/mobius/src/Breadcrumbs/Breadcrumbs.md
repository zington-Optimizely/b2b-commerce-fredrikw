### Example

```jsx
const style = { marginTop: '1rem' };

const links = [{
    children: 'Home',
    href: 'https://home.insitesoft.com'
}, {
    children: 'Category',
    onClick: () => alert('category')
}, {
    children: 'Subcategory',
    href: 'https://subcategory.insitesoft.com'
}, {
    children: 'Current Page'
}];

<>
    <Breadcrumbs links={links.slice(0, 2)} />
    <Breadcrumbs links={links.slice(0, 3)} style={style} />
    <Breadcrumbs links={links} style={style} />
</>
```
