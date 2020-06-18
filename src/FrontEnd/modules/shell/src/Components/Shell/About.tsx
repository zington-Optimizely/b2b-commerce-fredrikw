import React, { useState, useEffect } from "react";
import Typography from "@insite/mobius/Typography";
import { rawRequest } from "@insite/client-framework/Services/ApiService";
import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import { getDiagnostics } from "@insite/shell/Services/SpireService";

const About: React.FC = () => {
    const [spireStuff, update] = useState<SafeDictionary<string> | undefined>();

    useEffect(() => {
        if (spireStuff) {
            return;
        }

        update({ Loading: "..." });

        getDiagnostics().then(diagnostics => {
            update(diagnostics);
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
