import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const ResponsiveDesktop: React.FC<{ width?: number; height?: number; color1?: string; className?: string }> = ({
    width = undefined,
    height = undefined,
    color1 = "#4A4A4A",
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
                fill={color1}
                d="M21.8 0H1.2C.5 0 0 .6 0 1.3v12.5c0 .6.5 1.2 1.2 1.2H11v3H7.7c-.3 0-.5.2-.5.5s.2.5.5.5h7.7c.3 0 .5-.2.5-.5s-.3-.5-.6-.5H12v-3h9.8c.7 0 1.2-.6 1.2-1.3V1.3c0-.7-.5-1.3-1.2-1.3zm.2 13.5c0 .2-.2.4-.4.4H1.4c-.2 0-.4-.2-.4-.4V1.4c0-.2.2-.4.4-.4h20.3c.1 0 .3.2.3.4v12.1z"
            />
        </svg>
    );
};

export default React.memo(ResponsiveDesktop);
