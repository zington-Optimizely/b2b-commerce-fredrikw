// --------------------------------------------------------------------------------------------------------------------
// <copyright file="ExampleThemeLoader.cs" company="Insite Software">
//   Copyright © 2017. Insite Software. All rights reserved.
// </copyright>
// --------------------------------------------------------------------------------------------------------------------

namespace InsiteCommerce.Web.Themes.Example
{
    using Insite.WebFramework.Theming;

    /// <summary>
    /// An example of how to load a custom theme. This includes the current resources that are part of the responsive theme.
    /// The lists can be appended to or modified if desired.
    /// The ResponsiveThemeLoader also exposes these lists so that they can be referenced and concatenated to.
    /// </summary>
    public class ExampleThemeLoader

        // Uncomment this line to get the theme to load on site startup
        // : IThemeDtoLoader
    {
        public ThemeDto GetTheme()
        {
            return new ThemeDto
            {
                Name = "Example",
                ParentTheme = "Responsive",
                Description = "This is an example theme that is a copy of the responsive theme",
                DefinitionScripts =
                {
                    "~/SystemResources/Scripts/typings/*"
                },
                BodyEndScripts =
                {
                    "~/SystemResources/Scripts/Libraries/modernizr/2.6.2/custom.modernizr.js",
                    "~/SystemResources/Scripts/Libraries/jquery/1.12.4/jquery.min.js",
                    "~/SystemResources/Scripts/Libraries/foundation/5.4.6/foundation.min.js",
                    "~/SystemResources/Scripts/Libraries/jquery.validate/1.15.0/jquery.validate.min.js",
                    "~/SystemResources/Scripts/Libraries/jquery.validate/1.15.0/additional-methods.min.js",
                    "~/SystemResources/Scripts/Libraries/jquery.validate.unobtrusive.min.js",
                    "~/SystemResources/Scripts/Libraries/foundation/5.4.6/foundation/foundation.topbar.js",
                    "~/SystemResources/Scripts/Libraries/jquery.fastbutton/1.0.1/jquery.fastbutton.js",
                    "~/SystemResources/Scripts/Libraries/jquery.placeholder/0.7.0/jquery.placeholder.js",
                    "~/SystemResources/Scripts/Libraries/jquery.autocomplete/1.2.25/jquery.autocomplete.min.js",
                    "~/SystemResources/Scripts/Libraries/jquery.hammer/1.0.5/hammer.min.js",
                    "~/SystemResources/Scripts/Libraries/pickadate/3.5.0-custom/picker.js",
                    "~/SystemResources/Scripts/Libraries/pickadate/3.5.0-custom/picker.date.js",
                    "~/SystemResources/Scripts/Libraries/pickadate/3.5.0-custom/picker.time.js",
                    "~/SystemResources/Scripts/Libraries/enquire/2.1.2/enquire-min.js",
                    "~/SystemResources/Scripts/Libraries/easyResponsiveTabs/easyResponsiveTabs.js",
                    "~/SystemResources/Scripts/Libraries/angular/1.3.15/angular.js",
                    "~/SystemResources/Scripts/Libraries/angular/1.3.15/angular-sanitize.js",
                    "~/SystemResources/Scripts/Libraries/angular-cookie/4.1.0/angular-cookie.min.js",
                    "~/SystemResources/Scripts/Libraries/angular-filter/0.5.7/angular-filter.js",
                    "~/SystemResources/Scripts/Libraries/angular-utf8-base64/angular-utf8-base64.js",
                    "~/SystemResources/Scripts/Libraries/angular-ui-router/0.3.1/angular-ui-router.min.js",
                    "~/SystemResources/Scripts/Libraries/ng-map/0.0.0/ng-map.min.js",
                    "~/SystemResources/Scripts/Libraries/lodash/2.4.1/lodash.min.js",
                    "~/SystemResources/Scripts/Libraries/flexslider/2.5.0/jquery.flexslider-min.js",
                    "~/SystemResources/Scripts/Libraries/kendo-ui/v3.1111/js/kendo.core.min.js",
                    "~/SystemResources/Scripts/Libraries/kendo-ui/v3.1111/js/kendo.angular.min.js",
                    "~/SystemResources/Scripts/Libraries/kendo-ui/v3.1111/js/kendo.data.min.js",
                    "~/SystemResources/Scripts/Libraries/kendo-ui/v3.1111/js/kendo.popup.min.js",
                    "~/SystemResources/Scripts/Libraries/kendo-ui/v3.1111/js/kendo.list.min.js",
                    "~/SystemResources/Scripts/Libraries/kendo-ui/v3.1111/js/kendo.fx.min.js",
                    "~/SystemResources/Scripts/Libraries/kendo-ui/v3.1111/js/kendo.autocomplete.min.js",
                    "~/SystemResources/Scripts/Libraries/porthole/0.0.0/porthole.min.js",
                    "~/SystemResources/Scripts/Libraries/jquery-ui/1.9.2/jquery-ui.custom.min.js",
                    "~/SystemResources/Scripts/Libraries/jquery.cookie/1.3.1/jquery.cookie.js",
                    "~/SystemResources/Scripts/Libraries/zurb-responsive-tables/0.0.0/responsive-tables.js",
                    "~/SystemResources/Scripts/Libraries/moment/2.10.6/moment.min.js",
                    "~/SystemResources/Scripts/ContentAdminShell/insite.adminAccessToken.js",
                    "~/SystemResources/Themes/Responsive/Scripts/insite.error-logger.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/insite.module.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/Common/insite.common.module.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/insite.guid-helper.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/Core/insite.authentication-interceptor.factory.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/Core/insite.http-errors-interceptor.factory.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/insite.config.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/insite.content.directives.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/insite.content-pager.controller.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/insite.nav.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/insite.jquery-extensions.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/insite.core.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/insite.responsive.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/Common/insite.base-popup.service.ts",
                    "~/SystemResources/Themes/Responsive/Scripts/*"
                },
                Styles =
                {
                    "~/SystemResources/Themes/Responsive/Styles/normalize.css",
                    "~/SystemResources/Themes/Responsive/Styles/foundation.css",
                    "~/SystemResources/Scripts/Libraries/pickadate/3.5.0-custom/themes/classic.css",
                    "~/SystemResources/Scripts/Libraries/pickadate/3.5.0-custom/themes/classic.date.css",
                    "~/SystemResources/Scripts/Libraries/jquery-ui/1.9.2/jquery-ui.custom.css",
                    "~/SystemResources/Themes/Responsive/Styles/flexslider.css",
                    "~/SystemResources/Themes/Responsive/Styles/base.scss",
                    "~/SystemResources/Scripts/Libraries/zurb-responsive-tables/0.0.0/responsive-tables.css",
                    "~/SystemResources/Themes/Responsive/Styles/template/sign-in.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-settings.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-budget-management.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/checkout-cart.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/category-list.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/change-cust-ship-to.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/checkout-addresses.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/checkout-review-pay.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/create-account.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/dealer-locator.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/expired-link.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-invoice-details.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-invoice-history.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-job-quotes.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-addresses.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-dashboard.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-my-quotes.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-order-approval.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-order-approval-details.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/news-list.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/news-page.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/checkout-order-confirm.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-order-details.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-order-history.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-order-upload.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/product-comparison.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/quick-order-2.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-rma.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-requisition-approval.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/rfq.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-quote-details.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-saved-order-details.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-saved-orders.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-user-administration.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-user-setup.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-assign-edit-shipto.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-wishlist.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/product-list.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/product-category.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/compare-hopper.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/product-detail.scss",
                    "~/SystemResources/Themes/Responsive/Styles/template/ma-recently-purchased.scss"
                }
            };
        }
    }
}