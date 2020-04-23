import * as React from 'react';

const Home: React.FC<{ size?: number, color1?: string, className?: string }> = ({ size = 16, color1 = '#9B9B9B', className }) => (
<svg focusable="false" className={className} viewBox="0 0 16 16" width={size} height={size}>
    <path fill={color1} d="M2 8H0l8-8 8 8h-2v8h-4v-5H6v5H2V8z"/>
</svg>
);

export default React.memo(Home);
