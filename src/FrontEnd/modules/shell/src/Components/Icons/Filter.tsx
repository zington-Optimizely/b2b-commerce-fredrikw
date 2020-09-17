import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const Filter: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#9B9B9B",
    className,
}) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 18, 13);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 18 13"
            width={calculatedWidth}
            height={calculatedHeight}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill={color1}
                d="M5 10h8c.6 0 1 .4 1 1v1c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1v-1c0-.6.4-1 1-1zM3 5h12c.6 0 1 .4 1 1v1c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1zM1 0h16c.6 0 1 .4 1 1v1c0 .6-.4 1-1 1H1c-.6 0-1-.4-1-1V1c0-.6.4-1 1-1z"
            />
        </svg>
    );
};

export default React.memo(Filter);
