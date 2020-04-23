import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const CustomerSegment: React.FC<{ width?: number, height?: number, color1?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#4A4A4A', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 22, 19);
    return <svg focusable="false" className={className} viewBox="0 0 22 19" width={calculatedWidth} height={calculatedHeight}>
        <path fill={color1} d="M22 16.5c0-.9-.6-2.7-3-3.2-2-.4-2-1.1-2-1.6.8 0 2.3-.2 3.7-.5l.8-.2-.6-.6-.3-.3c-.9-1-1.6-1.7-1.6-5.6 0-1.8-.5-3.1-1.5-3.8C16-.4 13.8.1 13.4.3c-1.4 0-2.4.7-3 2-1.5-.5-3.2-.3-4.7.7-.5 0-1 .3-1.3.7-.7.9-.9 2.3-.6 3.9-.3.4-.3 1.2-.3 1.5 0 .4.2 2 1.1 2.4.3.7.8 1.4 1.5 2.1v.1c0 .7-.9 1.2-2.5 1.4C0 15.5 0 18.5 0 18.5v.5h16v-.5c0-.4-.1-1-.4-1.5H22v-.5zM1.1 18c.2-.6.8-1.7 2.6-1.9 2.3-.3 3.4-1.1 3.4-2.4v-.5L7 13c-.8-.7-1.3-1.4-1.5-2.1l-.1-.4H5c-.2 0-.5-1-.5-1.4 0-.3.1-.6.1-.8H5l-.1-.6c-.4-1.4-.3-2.7.2-3.3.2-.3.4-.4.7-.4H6l.1-.1c1.6-1.1 3.4-1.2 4.6-.4 1.1.8 1.4 2.3.9 4.1l-.2.4.5.1c0 .2.1.7.1 1 0 .4-.3 1.4-.5 1.4l-.4-.1-.1.5c-.2.9-.7 1.6-1.3 2.1l-.2.1v.6c0 1 .4 2 3.2 2.4 1.6.2 2.1 1.3 2.2 1.9H1.1zm13.8-2c-.5-.5-1.1-.8-2.1-.9-2.3-.3-2.3-1-2.3-1.4v-.1c.6-.6 1-1.3 1.3-2.1.9-.3 1.2-1.9 1.2-2.4 0-.2 0-1-.4-1.4.5-2.1 0-3.9-1.3-4.9 0 0-.1 0-.1-.1.4-1 1.1-1.4 2.2-1.4h.2s2-.7 3.3.3C17.6 2 18 3 18 4.5c0 3.8.7 5 1.5 5.9-1.4.3-2.8.3-3.1.3h-.5v1.1c0 .9.3 2 2.8 2.6 1.5.3 2 1.1 2.2 1.7h-6V16z"/>
    </svg>;
};

export default React.memo(CustomerSegment);
