import { isMobileAppCookieName } from "@insite/client-framework/Common/ContentMode";
import { generateDataIfNeeded } from "@insite/server-framework/PageRenderer";
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

export const shellRenderer = async (request: Request, response: Response) => {
    await generateDataIfNeeded(request);

    if (request.query?.isMobileApp !== undefined) {
        response.cookie(isMobileAppCookieName, request.query?.isMobileApp);
    }
    response.send(renderedShell);
};
