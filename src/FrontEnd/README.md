# Front End Setup (/FrontEnd)

1. [Install node/npm](https://nodejs.org/en/).
2. Run `npm install` from /FrontEnd.

Follow the instructions further down for use with [Visual Studio Code](#visual-studio-code) and [Rider/WebStorm](#riderwebstorm).

## Visual Studio Code

1. Open the /FrontEnd directory. A launch configuration is already present so no additional steps are required to start the application.
2. (Recommended) [Install the ESLint extension from Microsoft](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to see ESLint errors in the editor.

## Rider/WebStorm

- make sure to enable tslint settings - languages & frames - typescript - tslint - pick proper tslint.json file
- turn on recompile on changes to see ts errors in rider
- a number of launch configurations are already present.

# Launch Spire

1. Run `npm run start` from /FrontEnd. This launches Spire with the default blueprint and port. NOTE: This step is already setup in Visual Studio Code and Rider as a launch configuration.
2. Navigate to http://localhost:3000.

By default, API requests are forwarded to http://commerce.local.com. You can change this URL in the /FrontEnd/config/settings.js file.

# Launch Spire with a Custom Blueprint

In addition to launching Spire with the base blueprint, you can create a custom blueprint and launch spire using that blueprint. The steps to do that are below:

1. [Create a blueprint](https://support.insitesoft.com/hc/en-us/articles/360039410011-Create-a-New-Blueprint-in-Spire).
2. Run `npm run start {customBlueprintName}` from /FrontEnd.
3. Navigate to http://localhost:3000.

You can also create a launch configuration in Visual Studio Code or Rider to launch spire using the custom blueprint.

# Site Generation
The pages for a site will automatically generate the first time a request is made to the server, if there are no pages present. You can force the regeneration of the site by running the following SQL statement in your InsiteCommerce database:
```sql
DELETE FROM content.Node
```
and then loading the site again.