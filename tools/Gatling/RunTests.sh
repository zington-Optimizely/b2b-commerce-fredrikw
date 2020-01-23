#!/bin/bash
# Print each command when executing it, and stop if any commands return a non-zero exit code
set -xe
# Execute the rest of this script from the directory that the script lives in
# See https://stackoverflow.com/a/16349776
cd "${0%/*}"
echo "Running from from ${PWD}"

rm -rf report/
rm -rf Gatling-Parsing/results/
docker-compose down --volumes
docker-compose build
docker-compose run --rm gatling -s insitecommerce_performance.AnonymousBrowseAndAddToCart
docker-compose down --volumes
docker-compose run --rm gatling -s insitecommerce_performance.AnonymousBrowseAndAddToCart
docker-compose run --rm gatling -s insitecommerce_performance.AnonymousBrowseBrands
docker-compose run --rm gatling -s insitecommerce_performance.CreateAccount
docker-compose run --rm gatling -s insitecommerce_performance.SignIn
docker-compose run --rm gatling -s insitecommerce_performance.AuthenticatedBrowseAddToCartCheckout
docker-compose run --rm parser 
docker run -d -v gatling_parsed_results:/report --name  parsed-results-image alpine tail -f /dev/null
docker cp parsed-results-image:/report ${PWD}
docker rm -f parsed-results-image
docker-compose down --volumes
