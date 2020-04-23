import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const Modal: React.FC<{ width?: number, height?: number, color1?: string, color2?: string, color3?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#ACACAC', color2 = '#D8D8D8', color3 = '#FFF', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 22, 15);
    return <svg focusable="false" className={className} viewBox="0 0 22 15" width={calculatedWidth} height={calculatedHeight}>
        <path fillRule="evenodd" clipRule="evenodd" fill={color1} d="M22 3v10c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h17c1.1 0 2 .9 2 2z"/>
        <path fillRule="evenodd" clipRule="evenodd" fill={color2} d="M21 2v10c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V2C0 .9.9 0 2 0h17c1.1 0 2 .9 2 2z"/>
        <path fillRule="evenodd" clipRule="evenodd" fill={color3} d="M3 10h6v2H3zm0-3h8v1H3zm0-2h14v1H3zm0-2h11v1H3z"/>
    </svg>;
};

export default React.memo(Modal);
