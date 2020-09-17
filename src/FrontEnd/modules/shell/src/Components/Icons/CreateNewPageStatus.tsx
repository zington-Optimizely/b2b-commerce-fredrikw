import * as React from "react";

const CreateNewPageStatus: React.FC<{ size?: number; color1?: string; className?: string }> = ({
    size = 64,
    color1 = "#CCC",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 64 64" width={size} height={size}>
        <path
            fill={color1}
            d="M62 14H50V2c0-1.1-.9-2-2-2H2C.9 0 0 .9 0 2v46c0 1.1.9 2 2 2h12v12c0 1.1.9 2 2 2h46c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2zm-48 2v30H4V4h42v10H16c-1.1 0-2 .9-2 2zm46 44H18V18h42v42z"
        />
        <path fill={color1} d="M52 37H41V26h-4v11H26v4h11v11h4V41h11z" />
    </svg>
);

export default React.memo(CreateNewPageStatus);
