package insitecommerce_performance

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class AuthenticatedBrowseAddToCartCheckout extends Simulation {

  val myRamp  = java.lang.Long.getLong("ramp", 0L)
  val nbUrl = System.getProperty("url")
  val nbUsers = Integer.getInteger("users", 1)

  val httpProtocol = http
    .baseURL(nbUrl)
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .doNotTrackHeader("1")
    .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0")
    .disableCaching

  val userNameFeeder = Iterator.from(0).map(i => Map("userName" -> f"test$i%03d"))

  val addToCartQty = Array(
    Map("qtyOrdered" -> "1"),
    Map("qtyOrdered" -> "2"),
    Map("qtyOrdered" -> "3"),
    Map("qtyOrdered" -> "4"),
    Map("qtyOrdered" -> "5")
  ).random

  val categoryDetailFeeder = jsonUrl(nbUrl + "/api/v1/categories/feederData?type=categoryDetail").random 
  val productListFeeder = jsonUrl(nbUrl + "/api/v1/categories/feederData?type=productList").random 
  val productDetailFeeder = jsonUrl(nbUrl + "/api/v1/products/feederData").random 

  val scn = scenario("AuthenticatedBrowseAddToCartCheckout")
    .feed(userNameFeeder)
    .feed(categoryDetailFeeder)
    .feed(productListFeeder)
    .feed(productDetailFeeder)
    .feed(addToCartQty)
    .exec(AnonymousRequests.firstHome)
    .pause(1)
    .exec(AnonymousRequests.signInPage)
    .pause(1)
    .exec(AnonymousRequests.signIn)
    .pause(1)
    .exec(AuthenticatedRequests.firstHome)
    .pause(1)
    .exec(AuthenticatedRequests.categoryDetail)
    .pause(1)
    .exec(AuthenticatedRequests.productList)
    .pause(1)
    .exec(AuthenticatedRequests.productDetail)
    .pause(1)
    .exec(AuthenticatedRequests.addToCart)
    .pause(1)
    .exec(AuthenticatedRequests.cart)
    .pause(1)
    .exec(AuthenticatedRequests.checkoutAddresses)
    .pause(1)
    .exec(AuthenticatedRequests.checkoutReviewAndPay)
    .pause(1)
    .exec(AuthenticatedRequests.checkoutSubmitCart)
    .pause(1)
    .exec(AuthenticatedRequests.checkoutOrderConfirmation)
    .pause(1)
    .exec(AuthenticatedRequests.home)

  setUp(scn.inject(rampUsers(nbUsers) over (myRamp seconds))).protocols(httpProtocol)
}


