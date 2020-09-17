import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const Directory: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#D8D8D8",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 23, 19);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 23 19"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                opacity=".5"
                fill={color1}
                d="M3 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2v12c0 1.1-.9 2-2 2H3z"
            />
            <path fill={color1} d="M6 0L0 6v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2H6z" />
            <path fillOpacity=".2" d="M0 6h4c1.1 0 2-.9 2-2V0L0 6z" />
        </svg>
    );
};

export default React.memo(Directory);
