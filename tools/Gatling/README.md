# Gatling Performance Testing

[Gatling](https://github.com/gatling/gatling) is an open source stress testing tool. This repository contains Gatling simulations for testing the performance of InsiteCommerce under some common usage scenarios.

## Instructions

1. In your local ISC repo
    * Change compilation debug to false in web.config
    * Build ISC in release mode
2. In IIS, add an HTTP binding (and optionally an HTTPS binding) of `host.docker.internal` for the site
3. In your local ISC site's Admin Console
   * Change `Https Mode` to `Never`
   * Change `Cache Etags` to `ON`
   * Change `Enable Data Feeder Apis` to `YES`
   * For the main website, add `host.docker.internal` to the list of `Domain Name(s)`
4. Restart the site in IIS to make sure all settings have been applied
5. In this directory, run `docker-compose run --rm gatling`

> **IMPORTANT**: `CreateAccount` will create users on the target site, and `AuthenticatedBrowseAddToCartCheckout` will submit orders. Ensure that those changes are safe to perform on the target site.

6. Enter the number of the simulation to run. The only simulations that will run are the ones that start with `insitecommerce_performance` Note that `CreateAccount` must be run before `AuthenticatedBrowseAddToCartCheckout` or `SignIn`.

        Choose a simulation number:
            [6] insitecommerce_performance.AnonymousBrowseAndAddToCart
            [7] insitecommerce_performance.AnonymousBrowseBrands
            [8] insitecommerce_performance.AuthenticatedBrowseAddToCartCheckout
            [9] insitecommerce_performance.CreateAccount
            [10] insitecommerce_performance.SignIn

7. If the IIS site was restarted immediately prior to running the test, the site will not have "warmed up" prior to the test. In that case, re-run the same test again and analyze the second set of results.

## Configuring or Extending
### Configuring Gatling
To change the number of simulated users, target URL, or ramp for the Gatling tests update the -D defines in the JAVA_OPTS variable in `.env`.
* URL `-Durl=http://host.docker.internal`
* Users `-Dusers=50`
* Ramp `-Dramp=30`

DNS resolution inside a Docker container can be different than that of the host operation system, so you may have to add a hosts file entry such as `10.1.100.142 dev.local.com` depending on the location of the target site.

### Pushing to ElasticSearch 
We offer the option to push the results Gatling results to your ElasticSearch instance. The configuring of ElasticSearch is done in the `gatlingParser.py` file. You can pass the ElasticSearch URL as an environment variable in the `.env` file. If you want to use ElasticSearch set the **ELASTIC_STATE** to **on** and set the **ELASTIC_URL**.  


## Reviewing the Results
To export the results you need to run the following three commands: 
`docker run -d -v gatling_gatling_results:/results --name gatling-results-image alpine tail -f /dev/null`
`docker cp gatling-results-image:/results ${PWD}`
`docker rm -f gatling-results-image`
An overview of the results can be found in the terminal output, and detailed HTML reports can be found in the `results/` directory. Pay close attention to the p99 results as those "worst case scenarios" can be a leading indicator of negative user experience.

If the site is performing poorly, connect a profiling tool like DotTrace to the web worker process or configure [InsiteCommerce's built-in Prometheus metrics](https://support.insitesoft.com/hc/en-us/articles/360034897011), and re-run the simulation.

### Producing a report based on the results 
If you would like to produce a report after running the tests run the following commands. This will produce a global and a detailed CSV report where each test is included. 
`docker-compose run --rm parser `
`docker run -d -v gatling_parsed_results:/report --name  parsed-results-image alpine tail -f /dev/null`
`docker cp parsed-results-image:/report ${PWD}`
`docker rm -f parsed-results-image`
This will generate a CSV file located in report folder

## Automating the process
This whole process can be automated. You can pass the name of the test using the following command: `docker-compose run --rm gatling -s insitecommerce_performance.AnonymousBrowseBrands`. 

If you run `RunTests.sh` it will automatically run all the tests, parse the results and produce a report. You can set up the parameters  in the `.env` file. 
