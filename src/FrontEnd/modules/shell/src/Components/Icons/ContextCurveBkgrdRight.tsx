import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const ContextCurveBkgrdRight: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#E5E5E5",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 37.6, 35);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 37.6 35"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path fill={color1} d="M37.6 0L14.1 29.4C11.2 32.9 6.9 35 2.4 35H0L.1 0h37.5z" />
        </svg>
    );
};

export default React.memo(ContextCurveBkgrdRight);
