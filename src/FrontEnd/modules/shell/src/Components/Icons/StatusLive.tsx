import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const StatusLive: React.FC<{ width?: number, height?: number, color1?: string, color2?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#4A4A4A', color2 = '#D8D8D8', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 22, 19);
    return <svg focusable="false" className={className} viewBox="0 0 22 19" width={calculatedWidth} height={calculatedHeight}>
        <path fill="none" stroke={color1} d="M2.5.5h17c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-17c-1.1 0-2-.9-2-2v-14c0-1.1.9-2 2-2z"/>
        <path fill="none" stroke={color1} d="M7.5 12.1l2.5 2.3 5.5-6.9"/>
        <path fill={color1} d="M2 0h18c1.1 0 2 .9 2 2v3H0V2C0 .9.9 0 2 0z"/>
        <circle fill={color2} cx="3" cy="2.5" r="1"/>
        <circle fill={color2} cx="6" cy="2.5" r="1"/>
        <circle fill={color2} cx="9" cy="2.5" r="1"/>
    </svg>;
};

export default React.memo(StatusLive);
