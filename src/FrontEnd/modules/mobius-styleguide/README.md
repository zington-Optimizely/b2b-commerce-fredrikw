# @insite/mobius-styleguide

Visual documentation and sandbox for the Mobius component library.

## Running styleguide locally

NOTE: at present a collision between styled-components and styleguidist prevent components rendering with the current
version of styled-components installed. To run the styleguide locally, change the version of `styled-components` in
`mobius/package.json` to `4.4.1` and remove the peer `styled-components` dependency. Run `npm install` and then follow the
instructions below. 

To run the styleguide locally, run the start script from the mobius-styleguide folder: 
```
npm run start
```
The styleguide will run by default on localhost:6060.

## Building and Deploying

This package is currently being deployed to the gh-pages branch of this repository.
To push a new build, run the deploy script from the mobius-styleguide folder:
```
npm run deploy
```
