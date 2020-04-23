import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const Toast: React.FC<{ width?: number, height?: number, color1?: string, color2?: string, color3?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#ACACAC', color2 = '#D8D8D8', color3 = '#FFF', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 23, 11);
    return <svg focusable="false" className={className} viewBox="0 0 23 11" width={calculatedWidth} height={calculatedHeight}>
        <path fillRule="evenodd" clipRule="evenodd" fill={color1} d="M23 6c0 2.8-2.2 5-5 5H7c-2.8 0-5-2.2-5-5s2.2-5 5-5h11c2.8 0 5 2.2 5 5z"/>
        <path fillRule="evenodd" clipRule="evenodd" fill={color2} d="M22 5c0 2.8-2.2 5-5 5H5c-2.8 0-5-2.2-5-5s2.2-5 5-5h12c2.8 0 5 2.2 5 5z"/>
        <path fill="none" stroke={color3} d="M3 5l1 1 2-2"/>
        <path fillRule="evenodd" clipRule="evenodd" fill={color3} d="M8 6h11v1H8zm0-2h8v1H8z"/>
    </svg>;
};

export default React.memo(Toast);
