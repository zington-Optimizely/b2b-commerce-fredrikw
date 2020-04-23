import * as React from 'react';

const LanguageGeneric: React.FC<{ size?: number, color1?: string, color2?: string, className?: string }> = ({ size = 20, color1 = '#4A4A4A', color2 = '#FFF', className }) => (
<svg focusable="false" className={className} viewBox="0 0 20 20" width={size} height={size}>
    <path fill={color1} d="M17.9 16.2H2.1c-1.2 0-2.1-.9-2.1-2.1v-12C0 .9.9 0 2.1 0h15.8c1.2 0 2.1.9 2.1 2.1v12c0 1.2-.9 2.1-2.1 2.1z"/>
    <path fill={color2} d="M17.7.2H6.2L11.9 16h5.8c1.1 0 2-.9 2-2V2.2c0-1.1-.9-2-2-2z"/>
    <path fill={color1} d="M8.9 16.1l2.8 2.8c.8.8 2 .8 2.8 0l2.8-2.8H8.9zM18.3 6V5h-3.2V3.8h-1V5h-3.2v1h5c-.6 1.1-1.2 2-1.8 2.7-.4-.4-.9-.9-1.3-1.4L12 8c.5.5 1 1 1.4 1.5-.7.6-1.4 1-2.1 1v1c1 0 2-.5 2.9-1.4 1.2.9 2.4 1.4 3.7 1.4v-1c-1 0-2-.4-3-1.1.7-.8 1.4-2 2.1-3.3l1.3-.1z"/>
    <path fill={color2} d="M6.6 10.5H4.1L3.6 12H2l2.6-7.1H6L8.7 12H7.1l-.5-1.5zM4.5 9.3h1.8l-.9-2.6-.9 2.6z"/>
</svg>
);

export default React.memo(LanguageGeneric);
