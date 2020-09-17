import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const OverflowCreateVariant: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#9B9B9B",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 20.2, 17);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 20.2 17"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fill={color1}
                d="M14.4 5.8V0H0v11.2h5.8V17h14.4V5.8h-5.8zM1 10.2V1h12.4v4.8H5.8v4.5H1v-.1zM19.2 16H6.8V6.8h12.4V16z"
            />
            <path fill={color1} d="M16.5 11h-3V8h-1v3h-3v1h3v3h1v-3h3z" />
        </svg>
    );
};

export default React.memo(OverflowCreateVariant);
