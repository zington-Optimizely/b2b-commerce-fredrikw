import * as React from "react";

const ScreenSizeMinimize: React.FC<{ size?: number; color1?: string; color2?: string; className?: string }> = ({
    size = 50,
    color1 = "#F4F4F4",
    color2 = "#9B9B9B",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 50 50" width={size} height={size}>
        <path fillRule="evenodd" clipRule="evenodd" fill={color1} d="M0 0h50L0 50V0z" />
        <path
            fill={color2}
            d="M18.9 11.3c0-.6-.5-1-1-1-.6 0-1 .5-1 1v5.2L9.1 8.7c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l7.8 7.8h-5.2c-.5 0-1 .4-1 1s.4 1 1 1l8.7.1-.1-8.7z"
        />
    </svg>
);

export default React.memo(ScreenSizeMinimize);
