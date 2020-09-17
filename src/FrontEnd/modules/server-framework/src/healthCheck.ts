import { Request, Response } from "express";

const healthCheck = (() => {
    let activeQuickPing: Promise<{ status: number; text: () => Promise<string> }> | undefined;

    return async (request: Request, response: Response) => {
        const quickPing =
            activeQuickPing ??
            (activeQuickPing = fetch(`${process.env.ISC_API_URL}/QuickPing.aspx`)
                .catch(() => {
                    activeQuickPing = undefined;
                    return {
                        status: 500,
                        text: () => new Promise<string>(resolve => resolve("")),
                    };
                })
                .then(value => {
                    value.text(); // Consume the data to fully complete the request, don't need to wait for this.
                    activeQuickPing = undefined;
                    return value;
                }));
        const quickPingResponse = await quickPing;

        const { status } = quickPingResponse;
        response.status(status).json({
            nodeVersion: process.version, // Resolves any ambiguity about what version of Node is being used.
            checks: {
                quickPing: status === 200,
            },
        });
    };
})();

export default healthCheck;
