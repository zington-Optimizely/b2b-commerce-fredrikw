import * as React from "react";

const CheckmarkUnselect: React.FC<{ size?: number; color1?: string; color2?: string; className?: string }> = ({
    size = 21,
    color1 = "#FFF",
    color2 = "#78BC21",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 21 21" width={size} height={size}>
        <circle fillRule="evenodd" clipRule="evenodd" fill={color1} stroke={color2} cx="10.5" cy="10.5" r="10" />
    </svg>
);

export default React.memo(CheckmarkUnselect);
