import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const DirectoryExpanded: React.FC<{
    width?: number;
    height?: number;
    color1?: string;
    color2?: string;
    className?: string;
}> = ({ width = undefined, height = undefined, color1 = "#D8D8D8", color2 = "#FFF", className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 20, 16);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 20 16"
            width={calculatedWidth}
            height={calculatedHeight}
            enableBackground="new 0 0 20 16"
        >
            <path fill={color1} d="M6 0L0 6v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2H6z" />
            <defs>
                <filter id="a" filterUnits="userSpaceOnUse" x="0" y="0" width="6" height="6">
                    <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
                </filter>
            </defs>
            <mask maskUnits="userSpaceOnUse" x="0" y="0" width="6" height="6" id="b">
                <g filter="url(#a)">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        fill={color2}
                        d="M6 0L0 6v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2H6z"
                    />
                </g>
            </mask>
            <path mask="url(#b)" fillOpacity=".2" d="M0 6h4c1.1 0 2-.9 2-2V0L0 6z" />
        </svg>
    );
};

export default React.memo(DirectoryExpanded);
