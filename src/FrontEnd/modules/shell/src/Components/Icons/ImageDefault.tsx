import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const ImageDefault: React.FC<{ width?: number, height?: number, color1?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#9B9B9B', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 40, 30);
    return <svg focusable="false" className={className} viewBox="0 0 40 30" width={calculatedWidth} height={calculatedHeight}>
        <path fill={color1} d="M0 30L16 4l10 18 4.6-8.5L40 30z"/>
        <circle fill={color1} cx="31" cy="3" r="3"/>
    </svg>;
};

export default React.memo(ImageDefault);
