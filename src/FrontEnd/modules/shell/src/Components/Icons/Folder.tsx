import * as React from "react";
import calculateDimensions from "@insite/shell/Components/Icons/CalculateDimensions";

const Folder: React.FC<{
    width?: number;
    height?: number;
    color1?: string;
    color2?: string;
    color3?: string;
    className?: string;
}> = ({ width = undefined, height = undefined, color1 = "#FFF", color2 = "#D8D8D8", color3 = "#999", className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 20, 18);
    return (
        <svg
            focusable="false"
            className={className}
            viewBox="0 0 20 18"
            width={calculatedWidth}
            height={calculatedHeight}
            enableBackground="new 0 0 20 18"
        >
            <defs>
                <filter id="a" filterUnits="userSpaceOnUse" x="0" y="2" width="20" height="16">
                    <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" />
                </filter>
            </defs>
            <mask maskUnits="userSpaceOnUse" x="0" y="2" width="20" height="16" id="b">
                <g filter="url(#a)">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        fill={color1}
                        d="M2 2h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2z"
                    />
                </g>
            </mask>
            <g mask="url(#b)">
                <path fill={color2} d="M0 2h20v16H0V2z" />
            </g>
            <path fill={color3} d="M10.1 1.4C9.8.6 9.1 0 8.2 0H2C.9 0 0 .9 0 2v2c0-1.1.9-2 2-2h8.3l-.2-.6z" />
        </svg>
    );
};

export default React.memo(Folder);
