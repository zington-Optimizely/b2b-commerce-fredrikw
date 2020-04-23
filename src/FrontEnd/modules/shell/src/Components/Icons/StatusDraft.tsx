import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const StatusDraft: React.FC<{ width?: number, height?: number, color1?: string, color2?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#F5A623', color2 = '#BA8227', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 22, 19);
    return <svg focusable="false" className={className} viewBox="0 0 22 19" width={calculatedWidth} height={calculatedHeight}>
        <path fill="none" stroke={color1} d="M2.5.5h17c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2h-17c-1.1 0-2-.9-2-2v-14c0-1.1.9-2 2-2z"/>
        <path fill={color1} d="M2 0h18c1.1 0 2 .9 2 2v3H0V2C0 .9.9 0 2 0z"/>
        <circle fill={color2} cx="3" cy="2.5" r="1"/>
        <circle fill={color2} cx="6" cy="2.5" r="1"/>
        <circle fill={color2} cx="9" cy="2.5" r="1"/>
        <path fill={color1} d="M15.3 6.7c-.3-.4-.8-.6-1.2-.7-.5-.1-1 .1-1.4.5L6.2 13l-.9 3.7 3.7-.9 6.5-6.5c.4-.3.5-.8.5-1.4-.1-.4-.3-.9-.7-1.2zM7 14l1 1-1.3.3L7 14zm1.7.7l-1.4-1.4 5-5 1.4 1.4-5 5zm6.1-6.1l-.6.6-1.4-1.4.6-.6c.1-.1.3-.2.5-.2s.5.2.7.4L15 7l-.4.4c.1.1.7.7.2 1.2z"/>
    </svg>;
};

export default React.memo(StatusDraft);
