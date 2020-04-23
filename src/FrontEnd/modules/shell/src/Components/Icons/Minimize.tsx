import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const Minimize: React.FC<{ width?: number, height?: number, color1?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#9B9B9B', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 15.6, 15.5);
    return <svg focusable="false" className={className} viewBox="0 0 15.6 15.5" width={calculatedWidth} height={calculatedHeight}>
        <path fill={color1} d="M13.2 7.2c.4 0 .7-.3.7-.8s-.3-.8-.8-.8h-2.2l4.5-4.3c.3-.3.3-.8 0-1.1-.1-.1-.3-.2-.5-.2s-.4.1-.5.2L9.9 4.6V2.4c0-.4-.3-.8-.8-.8s-.8.3-.8.8v4.8h4.9zm-13 8.1c.3.3.8.3 1.1 0l4.4-4.4v2.2c0 .4.3.8.8.8s.6-.3.6-.7V8.4H2.3c-.4 0-.8.3-.8.8s.4.7.8.7h2.2L.1 14.3c-.2.3-.2.8.1 1z"/>
    </svg>;
};

export default React.memo(Minimize);
