import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const Experiment: React.FC<{ width?: number, height?: number, color1?: string, color2?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#5B9016', color2 = '#78BC21', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 20, 19);
    return <svg focusable="false" className={className} viewBox="0 0 20 19" width={calculatedWidth} height={calculatedHeight}>
        <path fillRule="evenodd" clipRule="evenodd" fill={color1} d="M14.1 7.2l-8.9 8.9c-.8.9-2.2.9-3.1 0s-.9-2.3 0-3.1l5.8-5.8 4.3-4.3L15.3 6l-1.2 1.2zM11.4 0c-.3.3-.1 1.7-.6 2.1l-.7.7-.1.1-8.9 8.9c-1.4 1.4-1.4 3.8 0 5.2s3.8 1.4 5.2 0l8.9-8.9.1-.1.7-.7c.4-.4 1.7-.3 2.1-.5L11.4 0z"/>
        <path fillRule="evenodd" clipRule="evenodd" fill={color2} d="M8.3 7.2L2.5 13c-.6.6-1.2 1.6-.8 2.5.1.2.2.4.4.6.9.9 2.3.9 3.1 0l8.9-8.9H8.3zM7 9.4c0-.4.3-.7.7-.7s.7.3.7.7-.4.7-.8.7c-.3 0-.6-.3-.6-.7zm-.8 1.5c0-.2.2-.4.4-.4s.4.2.4.4-.2.4-.4.4c-.2-.1-.4-.2-.4-.4zm1.9.3c0-.2.2-.4.4-.4s.4.2.4.4-.2.4-.4.4c-.3 0-.4-.2-.4-.4zm-3.3 1.5c0-.4.3-.7.7-.8.4 0 .7.3.8.7v.1c0 .4-.3.7-.7.7-.5 0-.8-.3-.8-.7zm-.4 1.8c0-.2.1-.4.3-.4.2 0 .4.1.4.3 0 .2-.2.4-.4.3-.1.2-.3 0-.3-.2z"/>
    </svg>;
};

export default React.memo(Experiment);
