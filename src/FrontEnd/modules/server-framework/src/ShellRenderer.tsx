import { Request, Response } from "express";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const renderedShell = `<!DOCTYPE html>${renderToStaticMarkup(
    <html>
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <title>Content Administration</title>
            <base href="/" />
            <link href="https://fonts.googleapis.com/css?family=Barlow:300,400,700&display=swap" rel="stylesheet" />
        </head>
        <body>
            <div id="react-app"></div>
            <script async defer src={`/dist/shell.js?v=${BUILD_DATE}`} />
            <script src="/SystemResources/Scripts/Libraries/ckfinder/3.4.1/ckfinder.js"></script>
        </body>
    </html>,
)}`;

// our code requires these to be async right now
// eslint-disable-next-line require-await
export const shellRenderer = async (request: Request, response: Response) => {
    response.send(renderedShell);
};
