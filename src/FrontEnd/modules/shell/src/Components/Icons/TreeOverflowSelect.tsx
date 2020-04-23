import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const TreeOverflowSelect: React.FC<{ width?: number, height?: number, color1?: string, color2?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#D8D8D8', color2 = '#FFF', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 12, 24);
    return <svg focusable="false" className={className} viewBox="0 0 12 24" width={calculatedWidth} height={calculatedHeight}>
        <path fillRule="evenodd" clipRule="evenodd" fill={color1} d="M2 0h8c1.1 0 2 .9 2 2v20c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V2C0 .9.9 0 2 0z"/>
        <circle fillRule="evenodd" clipRule="evenodd" fill={color2} cx="6" cy="6" r="2"/>
        <circle fillRule="evenodd" clipRule="evenodd" fill={color2} cx="6" cy="12" r="2"/>
        <circle fillRule="evenodd" clipRule="evenodd" fill={color2} cx="6" cy="18" r="2"/>
    </svg>;
};

export default React.memo(TreeOverflowSelect);
