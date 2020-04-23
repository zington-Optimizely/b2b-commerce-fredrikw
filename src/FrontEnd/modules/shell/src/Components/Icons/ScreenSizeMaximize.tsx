import * as React from 'react';

const ScreenSizeMaximize: React.FC<{ size?: number, color1?: string, color2?: string, className?: string }> = ({ size = 50, color1 = '#F4F4F4', color2 = '#9B9B9B', className }) => (
<svg focusable="false" className={className} viewBox="0 0 50 50" width={size} height={size}>
    <path fillRule="evenodd" clipRule="evenodd" fill={color1} d="M0 0h50L0 50V0z"/>
    <path fill={color2} d="M18.3 17.9L10.4 10h5.2c.5 0 1-.4 1-1s-.4-1-1-1H7l.1 8.7c0 .5.5 1 1 1 .6 0 1-.5 1-1v-5.2l7.8 7.8c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4z"/>
</svg>
);

export default React.memo(ScreenSizeMaximize);
