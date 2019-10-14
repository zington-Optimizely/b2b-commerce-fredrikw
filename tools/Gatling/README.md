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

6. Enter the number of the simulation to run. Note that `CreateAccount` must be run before `AuthenticatedBrowseAddToCartCheckout` or `SignIn`.

        Choose a simulation number:
            [0] insitecommerce_performance.AnonymousBrowseAndAddToCart
            [1] insitecommerce_performance.AnonymousBrowseBrands
            [2] insitecommerce_performance.AuthenticatedBrowseAddToCartCheckout
            [3] insitecommerce_performance.CreateAccount
            [4] insitecommerce_performance.SignIn

7. If the IIS site was restarted immediately prior to running the test, the site will not have "warmed up" prior to the test. In that case, re-run the same test again and analyze the second set of results.

## Reviewing the Results

An overview of the results can be found in the terminal output, and detailed HTML reports can be found in the `results/` directory. Pay close attention to the p99 results as those "worst case scenarios" can be a leading indicator of negative user experience.

If the site is performing poorly, connect a profiling tool like DotTrace to the web worker process or configure [InsiteCommerce's built-in Prometheus metrics](https://support.insitesoft.com/hc/en-us/articles/360034897011), and re-run the simulation.

## Configuring or Extending

Currently the simulations are hard-coded to target http://host.docker.internal which will run against whichever site is running on the host operating system on port 80. To run against a different site, change the Scala source for the simulation to point to the desired ISC site. DNS resolution inside a Docker container can be different than that of the host operation system, so you may have to add a hosts file entry such as `10.1.100.142 dev.local.com` depending on the location of the target site.

The simulations load one page per second for each simulated "user." This reflects a higher load per user than would be expected on a typical InsiteCommerce site. To change the number of simulated users, edit lines like `rampUsers(50) over (30 seconds)` in the Scala source.
