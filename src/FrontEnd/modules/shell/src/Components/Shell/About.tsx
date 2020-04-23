import React, { useState, useEffect } from "react";
import Typography from "@insite/mobius/Typography";
import { rawRequest } from "@insite/client-framework/Services/ApiService";

const About: React.FC = () => {
    const [spireStuff, update] = useState<{ [key: string]: string } | undefined>();

    useEffect(() => {
        if (spireStuff) {
            return;
        }

        update({ Loading: "..." });

        rawRequest("/.spire/diagnostics")
        .then(response => response.json())
        .then(parsed => {
            update(parsed ?? { Response: "Empty" });
        })
        .catch(() => {
            update({ Loading: "Failed" });
        });
    });

    return <>
        <Typography variant="h1">About</Typography>
        {spireStuff && <table>
            <tbody>
                {Object.keys(spireStuff).map(key => <tr key={key}>
                    <td>{key}</td>
                    <td>{spireStuff[key]}</td>
                </tr>)}
            </tbody>
        </table>}
    </>;
};

export default About;
