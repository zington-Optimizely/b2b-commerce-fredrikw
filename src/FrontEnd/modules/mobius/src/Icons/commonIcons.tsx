type RequireContext = __WebpackModuleApi.RequireContext;

interface ComponentDictionary {
    [key: string]: React.ComponentType<any>;
}

export function buildIconsObject(foundIcons: RequireContext) {
    const iconObject: ComponentDictionary = {};
    for (const iconKey of foundIcons.keys()) {
        const name = iconKey.replace("./", "").replace(".tsx", "");
        const iconComponent = foundIcons(iconKey).default as React.ComponentType<any>;
        if (iconComponent) {
            iconObject[name] = iconComponent;
        }
    }
    return iconObject;
}

const icons = require.context("./", true, /\.tsx$/);
const iconsObject = buildIconsObject(icons);

export default iconsObject;
