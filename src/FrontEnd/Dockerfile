# Command to build the base site with automatic Node/Linux image update:
# docker build --pull .

# A maintained LTS release is appropriate for production usage.  For Node, these are typically even-numbered major releases.
# "Current" versions should be periodically tested for early warning of compatibility problems.
# The run-time version (near the end of this file) can be different but should generally be kept the same.

# To build the build-base image used for customer sites (Linux container mode only because this uses buildkit)
# BASH
# DOCKER_BUILDKIT=1 && docker build --pull --target=build-base . -t registry.cloud.insitehq.net/spire/build-base:{version}
# Powershell
# $env:DOCKER_BUILDKIT=1; docker build --pull --target=build-base . -t registry.cloud.insitehq.net/spire/build-base:{version}
ARG BUILD_BASE="build-base"

# To build the runtime-base image used for customer sites (Linux container mode only because this uses buildkit)
# BASH
# DOCKER_BUILDKIT=1 && docker build --pull --target=runtime-base . -t registry.cloud.insitehq.net/spire/runtime-base:{version}
# Powershell
# $env:DOCKER_BUILDKIT=1; docker build --pull --target=runtime-base . -t registry.cloud.insitehq.net/spire/runtime-base:{version}
ARG RUNTIME_BASE="runtime-base"

ARG NODE_BASE_IMAGE="node:12-alpine"

FROM $NODE_BASE_IMAGE AS build-base

# These files rarely change and are the minimum required for `npm install` and Lerna.
WORKDIR /app
COPY ./package.json ./package-lock.json ./lerna.json ./
COPY ./modules/client-framework/package.json ./package-lock.json ./modules/client-framework/
COPY ./modules/content-library/package.json ./modules/content-library/package-lock.json ./modules/content-library/
COPY ./modules/mobius/package.json ./modules/mobius/package-lock.json ./modules/mobius/
COPY ./modules/server-framework/package.json ./package-lock.json ./modules/server-framework/
COPY ./modules/shell/package.json ./modules/shell/package-lock.json ./modules/shell/

RUN ["npm", "install", "--unsafe-perm"]

# Most branches will not change Mobius, so do the minimum required work to run its tests so the layer can be cached.
COPY ./babel.config.js ./constants.d.ts ./tsconfig.base.json ./
COPY ./modules/client-framework/src/Logger.ts ./modules/client-framework/src/
WORKDIR /app/modules/mobius
COPY ./modules/mobius/ ./
RUN ["npm", "test"]
WORKDIR /app

# Linter and Webpack configuration change occasionally.
COPY ./.eslintignore ./.eslintrc.js ./.stylelintrc ./
COPY ./config/webpack/ ./config/webpack/

# These files will change frequently, so useful caching is limited to different build arguments.
COPY ./modules/ ./modules/

# ESLint & Stylelint results don't vary by extension path but require all code to be present.
RUN ["npm", "run", "eslint"]
RUN ["npm", "run", "stylelint"]

# Copy this to get creators and other static files into the base build image.
COPY ./wwwroot/ ./wwwroot/

# This stage has to match the build stage in modules/blueprints/Dockerfile
FROM $BUILD_BASE AS build

WORKDIR /app
COPY ./modules/blueprints ./modules/blueprints/

# Create the JS bundles for the application.
ARG BLUEPRINT=content-library
RUN ["npm", "run", "build:docker"]

FROM $NODE_BASE_IMAGE AS runtime-base
# This is just here for automation so we can push our runtime-base image to the registry as it evolves

# This stage has to match the runtime stage in modules/blueprints/Dockerfile
FROM $RUNTIME_BASE AS runtime

WORKDIR /app

COPY --from=build /app/dist/. ./dist/
COPY --from=build /app/wwwroot/. ./wwwroot/

ARG BUILD_INFO=None

USER node
CMD ["node", "dist/server.js"]
