import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const Scheduled: React.FC<{ width?: number, height?: number, color1?: string, color2?: string, color3?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#D8D8D8', color2 = '#4A90E2', color3 = '#9B9B9B', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 20, 16);
    return <svg focusable="false" className={className} viewBox="0 0 20 16" width={calculatedWidth} height={calculatedHeight}>
        <path fill={color1} d="M18 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z"/>
        <path fill={color2} d="M18 0H2C.9 0 0 .9 0 2v2h20V2c0-1.1-.9-2-2-2z"/>
        <circle fill={color3} fillOpacity=".4" cx="4" cy="7" r="1"/>
        <circle fill={color3} cx="7" cy="7" r="1"/>
        <circle fill={color3} cx="10" cy="7" r="1"/>
        <circle fill={color3} cx="13" cy="7" r="1"/>
        <circle fill={color3} cx="16" cy="7" r="1"/>
        <circle fill={color3} cx="16" cy="10" r="1"/>
        <circle fill={color3} cx="13" cy="10" r="1"/>
        <circle fill={color3} cx="10" cy="10" r="1"/>
        <circle fill={color3} cx="7" cy="10" r="1"/>
        <circle fill={color3} cx="4" cy="10" r="1"/>
        <circle fill={color3} cx="4" cy="13" r="1"/>
        <circle fill={color3} cx="7" cy="13" r="1"/>
        <circle fill={color3} cx="10" cy="13" r="1"/>
        <circle fill={color3} cx="13" cy="13" r="1"/>
        <circle fill={color3} fillOpacity=".4" cx="16" cy="13" r="1"/>
    </svg>;
};

export default React.memo(Scheduled);
