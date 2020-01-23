package insitecommerce_performance

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class AnonymousBrowseBrands extends Simulation {
  val myRamp  = java.lang.Long.getLong("ramp", 0L)
  val nbUrl = System.getProperty("url")
  val nbUsers = Integer.getInteger("users", 1)

  val httpProtocol = http
    .baseURL(nbUrl)
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .doNotTrackHeader("1")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0")
    .disableCaching

  val brandDetailFeeder = jsonUrl(nbUrl + "/api/v1/brands/feederData").random 

  val scn = scenario("BrowseBrands")
    .feed(brandDetailFeeder)
    .exec(AnonymousRequests.firstHome)
    .pause(1)
    .exec(AnonymousRequests.brands)
    .pause(1)
    .exec(AnonymousRequests.brandDetail)
    .pause(1)
    .exec(AnonymousRequests.brandProductList)
    .pause(1)
    .exec(AnonymousRequests.home)

  setUp(scn.inject(rampUsers(nbUsers) over (myRamp seconds))).protocols(httpProtocol)
}
