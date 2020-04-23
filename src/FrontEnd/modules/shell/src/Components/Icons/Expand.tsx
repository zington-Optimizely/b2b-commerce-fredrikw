import * as React from 'react';

const Expand: React.FC<{ size?: number, color1?: string, className?: string }> = ({ size = 15.5, color1 = '#9B9B9B', className }) => (
<svg focusable="false" className={className} viewBox="0 0 15.5 15.5" width={size} height={size}>
    <path fill={color1} d="M10.7 0c-.4 0-.7.3-.7.8s.3.8.8.8H13L8.5 5.9c-.3.3-.3.8 0 1.1.1.1.3.2.5.2s.4-.1.5-.2L14 2.6v2.2c0 .4.3.8.8.8s.8-.3.8-.8V0h-4.9zM6.9 8.6c-.3-.3-.8-.3-1.1 0L1.4 13v-2.2c0-.4-.3-.8-.8-.8s-.6.3-.6.7v4.8h4.8c.4 0 .8-.3.8-.8s-.4-.7-.8-.7H2.6L7 9.6c.2-.3.2-.8-.1-1z"/>
</svg>
);

export default React.memo(Expand);
