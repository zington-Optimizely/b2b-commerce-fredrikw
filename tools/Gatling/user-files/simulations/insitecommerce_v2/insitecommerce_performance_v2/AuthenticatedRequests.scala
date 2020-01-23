package insitecommerce_performance_v2

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

object AuthenticatedRequests {
 
  val headers_0 = Map(
    "Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Upgrade-Insecure-Requests" -> "1")

  val headers_1 = Map("X-Requested-With" -> "XMLHttpRequest")

  val headers_2 = Map("Accept" -> "*/*")

  val headers_3 = Map(
    "Authorization" -> "Bearer ${bearerToken}",
    "X-Requested-With" -> "XMLHttpRequest")

  val headers_4 = Map(
    "Accept" -> "text/html",
    "Authorization" -> "Bearer ${bearerToken}",
    "X-Requested-With" -> "XMLHttpRequest")

  val headers_5 = Map(
    "Authorization" -> "Bearer ${bearerToken}",
    "Content-Type" -> "application/json;charset=utf-8",
    "X-Requested-With" -> "XMLHttpRequest")

  val firstHome = exec(
    http("Authenticated.FirstHome")
      .get("/")
      .headers(headers_0)
  ).exec(
    http("Authenticated.FirstHome.IsAuthenticated")
      .get("/account/isauthenticated?timestamp=1526591553327")
      .headers(headers_1)
      .resources(
        http("Authenticated.FirstHome.Settings")
          .get("/api/v1/settings?auth=true")
          .headers(headers_3),
        http("Authenticated.FirstHome.Sessions.Current")
          .get("/api/v1/sessions/current")
          .headers(headers_3),
        http("Authenticated.FirstHome.Carts.Current")
          .get("/api/v1/carts/current")
          .headers(headers_3),
        http("Authenticated.FirstHome.Websites.Current.CrossSells")
          .get("/api/v1/websites/current/crosssells")
          .headers(headers_3),
        http("Authenticated.FirstHome.Products.TopSellers")
          .get("/api/v2/products?filter=topsellers&topSellersMaxResults=20")
          .headers(headers_3),
        http("Authenticated.FirstHome.Products.RecentlyViewed")
          .get("/api/v2/products?filter=recentlyviewed")
          .headers(headers_3),
        http("Authenticated.FirstHome.Websites.Current")
          .get("/api/v1/websites/current?expand=languages,currencies&languageId=123ed44e-9f45-e511-bbcb-534e57000000")
          .headers(headers_3)
      )
  )

  val home = exec(
    http("Authenticated.Home")
      .get("/")
      .headers(headers_4)
      .resources(
        http("Authenticated.Home.IsAuthenticated")
          .get("/account/isauthenticated?timestamp=1526591553327")
          .headers(headers_1),
        http("Authenticated.Home.Sessions.Current")
          .get("/api/v1/sessions/current")
          .headers(headers_3),
        http("Authenticated.Home.Websites.Current.CrossSells")
          .get("/api/v1/websites/current/crosssells")
          .headers(headers_3),
        http("Authenticated.FirstHome.Products.TopSellers")
          .get("/api/v2/products?filter=topsellers&topSellersMaxResults=20")
          .headers(headers_3),
        http("Authenticated.FirstHome.Products.RecentlyViewed")
          .get("/api/v2/products?filter=recentlyviewed")
          .headers(headers_3)
      )
  )

  val categoryDetail = exec(
    http("Authenticated.CategoryDetail")
      .get("/Catalog/${categoryUrl}")
      .headers(headers_4)
      .resources(
        http("Authenticated.CategoryDetail.IsAuthenticated")
            .get("/account/isauthenticated?timestamp=1527011038247")
            .headers(headers_1),
        http("Authenticated.CategoryDetail.Sessions.Current")
          .get("/api/v1/sessions/current")
          .headers(headers_3),
        http("Authenticated.CategoryDetail.CatalogPages")
          .get("/api/v1/catalogpages?path=${categoryUrl}")
          .headers(headers_3),
        http("Authenticated.CategoryDetail.Products")
          .get("/api/v2/products?categoryId=${categoryId}&expand=attributes,facets&includeAttributes=IncludeOnProduct&page=1&sort=1")
          .headers(headers_3),
        http("Authenticated.CategoryDetail.Products.TopSellers")
          .get("/api/v2/products?filter=topsellers&topSellersCategoryIds=${categoryId}&topSellersMaxResults=20")
          .headers(headers_3)
      )
  )

  val productList = exec(
    http("Authenticated.ProductList")
      .get("/Catalog/${productListUrl}")
      .headers(headers_4)
      .resources(
        http("Authenticated.ProductList.IsAuthenticated")
            .get("/account/isauthenticated?timestamp=1527011038247")
            .headers(headers_1),
        http("Authenticated.ProductList.Sessions.Current")
          .get("/api/v1/sessions/current")
          .headers(headers_3),
        http("Authenticated.ProductList.CatalogPages")
          .get("/api/v1/catalogpages?path=${productListUrl}")
          .headers(headers_3),
        http("Authenticated.ProductList.Products")
          .get("/api/v2/products?categoryId=${productListId}&expand=attributes,facets&includeAttributes=IncludeOnProduct&page=1&sort=1")
          .headers(headers_3),
        http("Authenticated.ProductList.Products.TopSellers")
          .get("/api/v2/products/?filter=topsellers&topSellersCategoryIds=${productListId}&topSellersMaxResults=20")
          .headers(headers_3),
        http("Authenticated.ProductList.AvailabilityByWarehousePopup")
          .get("/PartialViews/Catalog-AvailabilityByWarehousePopup")
          .headers(headers_3)
      )
  )

  val productDetail = exec(
    http("Authenticated.ProductDetail")
      .get("/Catalog/${productDetailUrl}")
      .headers(headers_4)
      .resources(
        http("Authenticated.ProductDetail.IsAuthenticated")
            .get("/account/isauthenticated?timestamp=1527011038247")
            .headers(headers_1),
        http("Authenticated.ProductDetail.Sessions.Current")
          .get("/api/v1/sessions/current")
          .headers(headers_3),
        http("Authenticated.ProductDetail.CatalogPages")
          .get("/api/v1/catalogpages?path=${productDetailUrl}")
          .headers(headers_3),
        http("Authenticated.ProductDetail.Products")
          .get("/api/v2/products/${productDetailId}?expand=detail,content,images,documents,specifications,properties,warehouses,attributes,varianttraits,facets&includeAttributes=IncludeOnProduct")
          .headers(headers_3),
        http("Authenticated.ProductDetail.Products.RecentlyViewed")
          .get("/api/v2/products?filter=recentlyviewed")
          .headers(headers_3)
      )
  )

  val addToCart = exec(
    http("Authenticated.AddToCart")
      .post("/api/v1/carts/current/cartlines")
      .headers(headers_5)
      .body(StringBody("""{"productId":"${productDetailId}","qtyOrdered":${qtyOrdered},"unitOfMeasure":""}"""))
      .resources(
        http("Authenticated.AddToCart.AddToCartPopup")
          .get("/PartialViews/Cart-AddToCartPopup")
          .headers(headers_3),
        http("Authenticated.AddToCart.Carts.Current")
          .get("/api/v1/carts/current")
          .headers(headers_3))
  )

  val cart = exec(
    http("Authenticated.Cart")
      .get("/Cart")
      .headers(headers_4)
      .resources(
        http("Authenticated.Cart.IsAuthenticated")
          .get("/account/isauthenticated?timestamp=1527011038247")
          .headers(headers_1),
        http("Authenticated.Cart.Session.Current")
          .get("/api/v1/sessions/current")
          .headers(headers_3),
        http("Authenticated.Cart.Carts.Current")
          .get("/api/v1/carts/current?allowInvalidAddress=true&expand=cartlines,costcodes,hiddenproducts,shipping,tax")
          .headers(headers_3),
        http("Authenticated.Cart.Carts.Current.Promotions")
          .get("/api/v1/carts/current/promotions")
          .headers(headers_3),
        http("Authenticated.Cart.Websites.Current.CrossSells")
          .get("/api/v1/websites/current/crosssells")
          .headers(headers_3),
        http("Authenticated.Cart.Products.RecentlyViewed")
          .get("/api/v2/products?filter=recentlyviewed")
          .headers(headers_3)
      )
  )

  var checkoutAddresses = exec(
    http("Authenticated.Checkout.Addresses")
      .get("/Checkout/Addresses")
      .headers(headers_4)
      .resources(
        http("Authenticated.Checkout.Addresses.IsAuthenticated")
          .get("/account/isauthenticated?timestamp=1527011038247")
          .headers(headers_1),
        http("Authenticated.Checkout.Addresses.Websites.Current.AddressFields")
          .get("/api/v1/websites/current/addressfields")
          .headers(headers_3),
        http("Authenticated.Checkout.Addresses.Sessions.Current")
          .get("/api/v1/sessions/current")
          .headers(headers_3),
        http("Authenticated.Checkout.Addresses.Accounts.Current")
          .get("/api/v1/accounts/current")
          .headers(headers_3),
        http("Authenticated.Checkout.Addresses.Carts.Current")
          .get("/api/v1/carts/current?expand=shiptos,validation")
          .headers(headers_3),
        http("Authenticated.Checkout.Addresses.Websites.Current.Countries")
          .get("/api/v1/websites/current/countries?expand=states&languageId=123ed44e-9f45-e511-bbcb-534e57000000")
          .headers(headers_3))
  )

  var checkoutReviewAndPay = exec(
    http("Authenticated.Checkout.ReviewAndPay")
      .get("/Checkout/ReviewAndPay")
      .headers(headers_4)
      .resources(
        http("Authenticated.Checkout.ReviewAndPay.IsAuthenticated")
          .get("/account/isauthenticated?timestamp=1527011038247")
          .headers(headers_1),
        http("Authenticated.Checkout.ReviewAndPay.Sessions.Current")
          .get("/api/v1/sessions/current")
          .headers(headers_3),
        http("Authenticated.Checkout.ReviewAndPay.Websites.Current.Countries")
          .get("/api/v1/websites/current/countries?expand=states&languageId=a26095ef-c714-e311-ba31-d43d7e4e88b2")
          .headers(headers_3),
        http("Authenticated.Checkout.ReviewAndPay.Carts.Current")
          .get("/api/v1/carts/current?allowInvalidAddress=true&expand=cartlines,shipping,tax,carriers,paymentoptions,1557173731361&forceRecalculation=true")
          .headers(headers_3),
        http("Authenticated.Checkout.ReviewAndPay.Carts.Current.Promotions")
          .get("/api/v1/carts/current/promotions")
          .headers(headers_3))
  )

  var checkoutSubmitCart = exec(
    http("Authenticated.Checkout.SubmitCart.IsAuthenticated")
      .get("/account/isauthenticated?timestamp=1527011038247")
      .headers(headers_1)
      .resources(
        http("Authenticated.Checkout.SubmitCart")
          .patch("/api/v1/carts/current")
          .headers(headers_5)
          .body(StringBody("""{"status":"Submitted","poNumber":"123","paymentOptions":{}}"""))
            .check(status is 200)
            .check(jsonPath("$.id").saveAs("submittedCartId")),
        )
  )

  var checkoutOrderConfirmation = exec(
    http("Authenticated.Checkout.OrderConfirmation")
      .get("/Checkout/OrderConfirmation")
      .headers(headers_4)
    ).exec(
      AnonymousRequests.homeResources
    ).exec(
      http("Authenticated.Checkout.OrderConfirmation.IsAuthenticated")
        .get("/account/isauthenticated?timestamp=1527011038247")
        .headers(headers_1)
        .resources(
          http("Authenticated.Checkout.OrderConfirmation.Settings")
            .get("/api/v1/settings?auth=true")
            .headers(headers_3),
          http("Authenticated.Checkout.OrderConfirmation.Sessions.Current")
            .get("/api/v1/sessions/current")
            .headers(headers_3),
          http("Authenticated.Checkout.OrderConfirmation.Carts.Current")
            .get("/api/v1/carts/current")
            .headers(headers_3),
          http("Authenticated.Checkout.OrderConfirmation.Carts.SubmittedCart")
            .get("/api/v1/carts/${submittedCartId}?expand=cartlines,carriers,creditCardBillingAddress")
            .headers(headers_3)
            .check(status is 200)
            .check(jsonPath("$.orderNumber").saveAs("orderNumber")),
          http("Authenticated.Checkout.OrderConfirmation.Carts.SubmittedCart.Promotions")
            .get("/api/v1/carts/${submittedCartId}/promotions")
            .headers(headers_3),
          http("Authenticated.Checkout.OrderConfirmation.Websites.Current")
            .get("/api/v1/websites/current?expand=languages,currencies&languageId=123ed44e-9f45-e511-bbcb-534e57000000")
            .headers(headers_3)
        )
    ).exec(
        http("Authenticated.Checkout.OrderConfirmation.Orders.SubmittedCart")
          .get("/api/v1/orders/${orderNumber}")
          .headers(headers_3)
    )
}
