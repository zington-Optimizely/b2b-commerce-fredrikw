import { buildIconsObject } from "@insite/mobius/Icons/commonIcons";

const icons = require.context('./', true, /\.tsx$/);
const shellIconsObject = buildIconsObject(icons);

export default shellIconsObject;
