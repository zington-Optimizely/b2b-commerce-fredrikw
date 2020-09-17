import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const StatusScheduled: React.FC<{
    width?: number;
    height?: number;
    color1?: string;
    color2?: string;
    color3?: string;
    className?: string;
}> = ({
    width = undefined,
    height = undefined,
    color1 = "#4A90E2",
    color2 = "#9B9B9B",
    color3 = "#D8D8D8",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 22, 19);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 22 19"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fill={color1}
                d="M20 0H2C.9 0 0 .9 0 2v14.5C0 17.9 1.1 19 2.5 19h17c1.4 0 2.5-1.1 2.5-2.5V2c0-1.1-.9-2-2-2zm1 16.5c0 .8-.7 1.5-1.5 1.5h-17c-.8 0-1.5-.7-1.5-1.5V5h20v11.5z"
            />
            <circle fill={color2} fillOpacity=".4" cx="5" cy="8" r="1" />
            <circle fill={color1} cx="8" cy="8" r="1" />
            <circle fill={color1} cx="11" cy="8" r="1" />
            <circle fill={color1} cx="14" cy="8" r="1" />
            <circle fill={color1} cx="17" cy="8" r="1" />
            <circle fill={color1} cx="17" cy="11" r="1" />
            <circle fill={color1} cx="14" cy="11" r="1" />
            <circle fill={color1} cx="11" cy="11" r="1" />
            <circle fill={color1} cx="8" cy="11" r="1" />
            <circle fill={color1} cx="5" cy="11" r="1" />
            <circle fill={color1} cx="5" cy="14" r="1" />
            <circle fill={color1} cx="8" cy="14" r="1" />
            <circle fill={color1} cx="11" cy="14" r="1" />
            <circle fill={color1} cx="14" cy="14" r="1" />
            <circle fill={color2} fillOpacity=".4" cx="17" cy="14" r="1" />
            <circle fill={color3} cx="3" cy="2.5" r="1" />
            <circle fill={color3} cx="6" cy="2.5" r="1" />
            <circle fill={color3} cx="9" cy="2.5" r="1" />
        </svg>
    );
};

export default React.memo(StatusScheduled);
