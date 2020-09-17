import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const ToggleSwitchOff: React.FC<{
    width?: number;
    height?: number;
    color1?: string;
    color2?: string;
    className?: string;
}> = ({ width = undefined, height = undefined, color1 = "#4A4A4A", color2 = "#FFF", className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 40, 21);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 40 21"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fill={color1}
                stroke={color1}
                d="M10.5.5h19c5.5 0 10 4.5 10 10h0c0 5.5-4.5 10-10 10h-19c-5.5 0-10-4.5-10-10h0C.5 5 5 .5 10.5.5z"
            />
            <circle fill={color2} fillOpacity=".25" cx="10.5" cy="10.5" r="8.5" />
        </svg>
    );
};

export default React.memo(ToggleSwitchOff);
