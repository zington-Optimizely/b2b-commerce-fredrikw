import get from "../utilities/get";
import buttonSizeVariants from "./buttonSizeVariants";

const buttonShapes = {
    pill: ({ _sizeVariant, _size }: { _sizeVariant?: keyof typeof buttonSizeVariants; _size?: number }) => {
        const diameter = _size || get(buttonSizeVariants, [_sizeVariant, "height"]);
        return `border-radius: ${diameter / 2}px;`;
    },
    rounded: () => `
        border-radius: .5em;
    `,
};

export default buttonShapes;
