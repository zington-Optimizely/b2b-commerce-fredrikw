import { SafeDictionary } from "@insite/client-framework/Common/Types";
import Typography from "@insite/mobius/Typography";
import { getDiagnostics } from "@insite/shell/Services/SpireService";
import React, { useEffect, useState } from "react";

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
