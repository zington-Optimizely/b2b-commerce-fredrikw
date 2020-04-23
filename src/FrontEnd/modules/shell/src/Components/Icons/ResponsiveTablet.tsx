import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const ResponsiveTablet: React.FC<{ width?: number, height?: number, color1?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#4A4A4A', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 17, 20);
    return <svg focusable="false" className={className} viewBox="0 0 17 20" width={calculatedWidth} height={calculatedHeight}>
        <path fill="none" stroke={color1} d="M16.5 18.9c0 .4-.3.6-.7.6H1.2c-.4 0-.7-.3-.7-.6V1.1c0-.4.3-.6.7-.6h14.6c.4 0 .7.3.7.6v17.8z"/>
        <circle fillRule="evenodd" clipRule="evenodd" fill={color1} cx="8.5" cy="16.5" r="1"/>
    </svg>;
};

export default React.memo(ResponsiveTablet);
