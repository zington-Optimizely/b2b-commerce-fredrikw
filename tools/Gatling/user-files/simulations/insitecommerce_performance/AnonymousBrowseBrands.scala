package insitecommerce_performance

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class AnonymousBrowseBrands extends Simulation {

  val httpProtocol = http
    .baseURL("http://host.docker.internal")
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .doNotTrackHeader("1")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0")
    .disableCaching

  val brandDetailFeeder = jsonUrl("http://host.docker.internal/api/v1/brands/feederData").random 

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

  setUp(scn.inject(rampUsers(50) over (30 seconds))).protocols(httpProtocol)
}
