import * as React from "react";

const Cms: React.FC<{ size?: number; color1?: string; color2?: string; className?: string }> = ({
    size = 60,
    color1 = "#78BB43",
    color2 = "#FEFEFE",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 60 60" width={size} height={size}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            fill={color1}
            d="M30 0c16.6 0 30 13.4 30 30S46.6 60 30 60 0 46.6 0 30 13.4 0 30 0"
        />
        <path
            fill={color2}
            d="M46.6 20l-5.4-5.4-9.9 9.9-9.9-9.9-6.8 6.8 9.8 9.9-5.5 5.5-4.3 9.7 9.7-4.3 5.5-5.5 9.7 9.8 6.9-6.9-9.8-9.8 10-9.8zm-5.4-2.6l2.6 2.6-1.8 1.7-2.6-2.6 1.8-1.7zM23.9 28l2.3-2.3-1.4-1.4-2.3 2.3-1.7-1.8 1.5-1.5-1.4-1.4-1.5 1.5-2-2 4-4 8.5 8.5-4 4-2-1.9zm-5.4 14.7l1.6-3.5 2 2-3.6 1.5zm5.2-2.7l-2.6-2.6 5.4-5.4 5.4-5.4 6.1-6 2.6 2.6-11.5 11.4-5.4 5.4zm19.9-.3l-4.1 4.1-1.9-1.9 2.1-2.1-1.4-1.4-2.1 2.1-1.6-1.6 1.5-1.5-1.4-1.4-1.5 1.5-2.1-2.1 4-4 8.5 8.3z"
        />
    </svg>
);

export default React.memo(Cms);
