import * as React from 'react';

const Tooltip: React.FC<{ size?: number, color1?: string, className?: string }> = ({ size = 19.2, color1 = '#9B9B9B', className }) => (
<svg focusable="false" className={className} viewBox="0 0 19.2 19.2" width={size} height={size}>
    <path fill="none" stroke={color1} strokeWidth="1.2" d="M18.6 9.6c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9z"/>
    <path fill={color1} d="M10.8 13.8h-.6V7.2H8.4v1.2H9v5.4h-.6V15h2.4z"/>
    <circle fill={color1} cx="9.4" cy="5.2" r="1"/>
</svg>
);

export default React.memo(Tooltip);
