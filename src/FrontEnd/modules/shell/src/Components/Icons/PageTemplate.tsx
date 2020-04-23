import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const PageTemplate: React.FC<{ width?: number, height?: number, color1?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#D8D8D8', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 20, 16);
    return <svg focusable="false" className={className} viewBox="0 0 20 16" width={calculatedWidth} height={calculatedHeight}>
        <path fill={color1} d="M6 0L0 6v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2H6z"/>
        <path fillOpacity=".2" d="M0 6h4c1.1 0 2-.9 2-2V0L0 6z"/>
        <path opacity=".2" d="M7 4v2h3v7h2V6h3V4z"/>
    </svg>;
};

export default React.memo(PageTemplate);
