// because production is different than dev, these have to be functions to make sure __basedir is available
export const getAppDataPath = () => `${(global as any).__basedir}/wwwroot/AppData`;

export const getBlueprintAppDataPath = () =>
    `${(global as any).__basedir}/modules/blueprints/${BLUEPRINT_NAME}/wwwroot/AppData`;
