import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const SmartWidget: React.FC<{
    width?: number;
    height?: number;
    color1?: string;
    color2?: string;
    className?: string;
}> = ({ width = undefined, height = undefined, color1 = "#D8D8D8", color2 = "#ACACAC", className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 22, 14);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 22 14"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fill={color1}
                d="M22 1.3H12V1c0-.6-.4-1-1-1H1C.4 0 0 .4 0 1v12c0 .6.4 1 1 1h10c.6 0 1-.4 1-1v-.3h10V1.3zm-2 9.4h-8V3.3h8v7.4z"
            />
            <path fill="none" stroke={color2} strokeWidth="1.5" d="M18.3 4.5v1.3h-2.6V4.5m2.6 3.1v1.3h-2.6V7.6" />
        </svg>
    );
};

export default React.memo(SmartWidget);
