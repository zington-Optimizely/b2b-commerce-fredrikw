import * as React from 'react';

const CheckmarkSelected: React.FC<{ size?: number, color1?: string, className?: string }> = ({ size = 21, color1 = '#78BC21', className }) => (
<svg focusable="false" className={className} viewBox="0 0 21 21" width={size} height={size}>
    <path fill={color1} d="M10.5 21C4.7 21 0 16.3 0 10.5S4.7 0 10.5 0 21 4.7 21 10.5 16.3 21 10.5 21zm0-20C5.3 1 1 5.3 1 10.5S5.3 20 10.5 20s9.5-4.3 9.5-9.5S15.7 1 10.5 1z"/>
    <path fillRule="evenodd" clipRule="evenodd" fill={color1} d="M15.3 8.8l-5.4 5.4-3.3-3.3c-.2-.2-.2-.6 0-.9.2-.2.6-.2.9 0l2.4 2.4 4.5-4.5c.2-.2.6-.2.9 0 .2.2.2.6 0 .9m2.3-5.4C13.7-.5 7.4-.5 3.5 3.4s-3.9 10.2 0 14.1 10.2 3.9 14.1 0 3.9-10.2 0-14.1"/>
</svg>
);

export default React.memo(CheckmarkSelected);
