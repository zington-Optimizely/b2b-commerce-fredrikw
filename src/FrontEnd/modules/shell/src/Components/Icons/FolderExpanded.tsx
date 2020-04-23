import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const FolderExpanded: React.FC<{ width?: number, height?: number, color1?: string, color2?: string, color3?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#999', color2 = '#F4F4F4', color3 = '#D8D8D8', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 23.1, 18);
    return <svg focusable="false" className={className} viewBox="0 0 23.1 18" width={calculatedWidth} height={calculatedHeight}>
        <path fill={color1} d="M10.3 2H18c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V2C0 .9.9 0 2 0h6.2c.9 0 1.7.6 1.9 1.4l.2.6z"/>
        <path fill={color2} d="M3.1 3h14c1.1 0 2 .9 2 2v11c0 1.1-.9 2-2 2h-14c-1.1 0-2-.9-2-2V5c0-1.1.8-2 2-2z"/>
        <path fill={color3} d="M4.6 5h16c1.1 0 2 .9 2 2 0 .2 0 .3-.1.5l-2.1 9c-.2.9-1 1.6-1.9 1.5H2c-1.1 0-2-.9-2-2 0-.2 0-.4.1-.5l2.6-9c.2-.9 1-1.5 1.9-1.5z"/>
    </svg>;
};

export default React.memo(FolderExpanded);
