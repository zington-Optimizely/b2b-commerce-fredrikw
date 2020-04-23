import * as React from 'react';
import calculateDimensions from '@insite/shell/Components/Icons/CalculateDimensions';

const OverflowCreateExperiment: React.FC<{ width?: number, height?: number, color1?: string, color2?: string, className?: string }> = ({ width = undefined, height = undefined, color1 = '#9B9B9B', color2 = '#FFF', className }) => {
    const { calculatedWidth, calculatedHeight } = calculateDimensions(width, height, 20, 19);
    return <svg focusable="false" className={className} viewBox="0 0 20 19" width={calculatedWidth} height={calculatedHeight} enableBackground="new 0 0 20 19">
        <path fillRule="evenodd" clipRule="evenodd" fill={color1} d="M15.9 12.3c0 .1 0 .1 0 0 0 .1-.1.2-.1.3v.4c0 1 .8 1.8 1.8 1.8s1.8-.8 1.8-1.8v-.4c0-.1 0-.2-.1-.3-.4-1-1.7-1.6-1.7-2.9 0 1.4-1.2 1.9-1.7 2.9"/>
        <path fillRule="evenodd" clipRule="evenodd" fill={color2} d="M18.2 13.7c-.3.2-.6.4-1 .5v.5h.4c.4 0 .8-.2 1.1-.4l-.5-.6zm.7.3l.3-.6-.4-.4c-.1.2-.2.4-.4.5l.5.5z"/>
        <path fillRule="evenodd" clipRule="evenodd" fill={color1} d="M14.1 7.2l-8.9 8.9c-.8.9-2.2.9-3.1 0s-.9-2.3 0-3.1l5.8-5.8 4.3-4.3L15.3 6l-1.2 1.2zM11.4 0c-.3.3-.1 1.7-.6 2.1l-.7.7-.1.1-8.9 8.9c-1.4 1.4-1.4 3.8 0 5.2s3.8 1.4 5.2 0l8.9-8.9.1-.1.7-.7c.4-.4 1.7-.3 2.1-.5L11.4 0z"/>
        <defs>
            <filter id="a" filterUnits="userSpaceOnUse" x="1.6" y="7.2" width="12.5" height="9.6">
                <feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0"/>
            </filter>
        </defs>
        <mask maskUnits="userSpaceOnUse" x="1.6" y="7.2" width="12.5" height="9.6" id="b">
            <g filter="url(#a)">
                <path fillRule="evenodd" clipRule="evenodd" fill={color2} d="M8.3 7.2C5.7 9.8 2.8 12.6 2.5 13c-.6.6-1.2 1.6-.8 2.5.1.2.2.4.4.6.9.9 2.3.9 3.1 0l8.9-8.9H8.3zM7 9.4c0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7-.4 0-.7-.3-.7-.7zm-.8 1.5c0-.2.2-.4.4-.4s.4.2.4.4-.2.4-.4.4c-.2-.1-.4-.2-.4-.4zm1.9.3c0-.2.2-.4.4-.4s.4.2.4.4-.2.4-.4.4c-.3 0-.4-.2-.4-.4zm-3.3 1.5c0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7-.4 0-.7-.3-.7-.7zm-.4 1.8c0-.2.2-.4.4-.4s.4.2.4.4-.2.4-.4.4-.4-.2-.4-.4z"/>
            </g>
        </mask>
        <path mask="url(#b)" fillRule="evenodd" clipRule="evenodd" fill={color1} fillOpacity=".499" d="M8.3 7.2C5.7 9.8 2.8 12.6 2.5 13c-.6.6-1.2 1.6-.8 2.5.1.2.2.4.4.6.9.9 2.3.9 3.1 0l8.9-8.9H8.3zM7 9.4c0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7-.4 0-.7-.3-.7-.7zm-.8 1.5c0-.2.2-.4.4-.4s.4.2.4.4-.2.4-.4.4c-.2-.1-.4-.2-.4-.4zm1.9.3c0-.2.2-.4.4-.4s.4.2.4.4-.2.4-.4.4c-.3 0-.4-.2-.4-.4zm-3.3 1.5c0-.4.3-.7.7-.7.4 0 .7.3.7.7 0 .4-.3.7-.7.7-.4 0-.7-.3-.7-.7zm-.4 1.8c0-.2.2-.4.4-.4s.4.2.4.4-.2.4-.4.4-.4-.2-.4-.4z"/>
    </svg>;
};

export default React.memo(OverflowCreateExperiment);
