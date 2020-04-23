/* eslint-disable @typescript-eslint/no-var-requires */
const { exec } = require("child_process");

let goodFencesStarted = false;

class GoodFencesPlugin {
    apply(compiler)  {
        compiler.hooks.make.tap('GoodFences', () => {
            if (goodFencesStarted) return;
            goodFencesStarted = true;
            console.log('Running Good Fences.');
            exec('npx gf -p tsconfig.base.json', (err, stdout, stderr) => {
                if (stdout) process.stdout.write(stdout);
                if (stderr) {
                    process.stderr.write(stderr);
                    throw 'Good Fences Violation';
                } else {
                    console.log('Good Fences passed.');
                }
            });
        });
    }
}

module.exports = GoodFencesPlugin;
