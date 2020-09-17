import * as React from "react";

const Close: React.FC<{ size?: number; color1?: string; className?: string }> = ({
    size = 18,
    color1 = "#4A4A4A",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 18 18" width={size} height={size}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill={color1}
            d="M11.6 12.4L9 9.7l-2.6 2.6c-.2.2-.5.2-.7 0s-.2-.5 0-.7L8.3 9 5.6 6.4c-.2-.2-.2-.5 0-.7s.5-.2.7 0L9 8.3l2.6-2.6c.2-.2.5-.2.7 0s.2.5 0 .7L9.7 9l2.6 2.6c.2.2.2.5 0 .7s-.5.3-.7.1m3.8-9.8C11.9-.9 6.2-.9 2.7 2.6s-3.5 9.2 0 12.7 9.2 3.5 12.7 0 3.5-9.1 0-12.7"
        />
    </svg>
);

export default React.memo(Close);
