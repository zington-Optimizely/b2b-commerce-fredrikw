import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const PageOptions: React.FC<{ width?: number, height?: number, color1?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#4A4A4A', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 18.3, 16.1);
    return <svg focusable="false" className={className} viewBox="0 0 18.3 16.1" width={calculatedWidth} height={calculatedHeight}>
        <path fill={color1} d="M4 16.1H.6c-.3 0-.6-.3-.6-.6s.3-.5.6-.5h1.1V.6c0-.3.3-.6.6-.6s.6.3.6.6V15H4c.3 0 .6.3.6.6s-.3.5-.6.5zm12-.1c-.3 0-.6-.3-.6-.6v-12h-1.1c-.3 0-.6-.3-.6-.6s.3-.6.6-.6h1.1V.6c.1-.3.3-.6.6-.6s.6.3.6.6v1.7h1.1c.3 0 .6.3.6.6s-.3.6-.6.6h-1.1v12c0 .3-.2.5-.6.5zm-6.8 0c-.3 0-.6-.3-.6-.6V8.6H7.4c-.3 0-.5-.3-.5-.6s.3-.6.6-.6h1.1V.6c0-.3.3-.6.6-.6s.6.3.6.6v6.9h1.1c.3 0 .6.3.6.6s-.3.6-.6.6H9.7v6.9c0 .2-.2.4-.5.4z"/>
    </svg>;
};

export default React.memo(PageOptions);
