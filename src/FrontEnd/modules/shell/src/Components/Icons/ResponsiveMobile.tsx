import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const ResponsiveMobile: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#4A4A4A",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 13, 20);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 13 20"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fill="none"
                stroke={color1}
                d="M12.5 18.5c0 .5-.4 1-1 1h-10c-.6 0-1-.4-1-1v-17c0-.5.4-1 1-1h10c.6 0 1 .4 1 1v17h0z"
            />
            <circle fillRule="evenodd" clipRule="evenodd" fill={color1} cx="6.5" cy="16.5" r="1" />
        </svg>
    );
};

export default React.memo(ResponsiveMobile);
