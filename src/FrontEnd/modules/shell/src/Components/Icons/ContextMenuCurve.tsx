import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const ContextMenuCurve: React.FC<{ width?: number, height?: number, color1?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#4A4A4A', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 30.5, 9.5);
    return <svg focusable="false" className={className} viewBox="0 0 30.5 9.5" width={calculatedWidth} height={calculatedHeight}>
        <path fillRule="evenodd" clipRule="evenodd" fill={color1} d="M21.8 3.5c-3.9-4.7-10.3-4.7-14.3 0L4.8 6.7S1.9 9.5 0 9.5h30.5c-1.1 0-3.9-.5-6.1-2.8l-2.6-3.2z"/>
    </svg>;
};

export default React.memo(ContextMenuCurve);
