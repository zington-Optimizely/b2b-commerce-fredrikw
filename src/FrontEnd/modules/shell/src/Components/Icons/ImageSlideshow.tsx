import * as React from "react";

const ImageSlideshow: React.FC<{ size?: number; color1?: string; className?: string }> = ({
    size = 17,
    color1 = "#4A4A4A",
    className,
}) => (
    <svg focusable="false" className={className} viewBox="0 0 17 17" width={size} height={size}>
        <path
            fill={color1}
            d="M14.4 0H2.5C1.1 0 0 1.1 0 2.5v11.9C0 15.9 1.1 17 2.5 17h11.9c1.4 0 2.6-1.1 2.6-2.6V2.5C17 1.1 15.9 0 14.4 0zM1.7 2.5c0-.5.3-.8.8-.8h11.9c.5 0 .9.3.9.8V9l-2.8-2.8c-.3-.3-.9-.3-1.2 0l-9 9c-.3-.1-.6-.4-.6-.8V2.5zm12.7 12.8H4.6L11.9 8l3.4 3.4v3.1c0 .5-.3.8-.9.8zM5.5 7.7c1.2 0 2.1-.9 2.1-2.1s-.9-2.2-2.1-2.2-2.1.9-2.1 2.1.9 2.2 2.1 2.2zm0-2.6c.3 0 .4.2.4.4 0 .3-.2.4-.4.4-.3 0-.4-.2-.4-.4s.2-.4.4-.4z"
        />
    </svg>
);

export default React.memo(ImageSlideshow);
