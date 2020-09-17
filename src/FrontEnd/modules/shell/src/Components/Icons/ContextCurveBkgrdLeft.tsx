import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const ContextCurveBkgrdLeft: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
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
            <path fill={color1} d="M0 0h37.5l.1 35h-2.4c-4.6 0-8.9-2.1-11.7-5.6L0 0z" />
        </svg>
    );
};

export default React.memo(ContextCurveBkgrdLeft);
