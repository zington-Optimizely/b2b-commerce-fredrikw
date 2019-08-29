module insite.catalog {
    "use strict";

    export class TellAFriendController {
        tellAFriendModel: TellAFriendModel;
        product: ProductDto;
        isSuccess: boolean;
        isError: boolean;
        inProgress: boolean;

        static $inject = ["$scope", "emailService", "$timeout"];

        constructor(
            protected $scope: ng.IScope,
            protected emailService: email.IEmailService,
            protected $timeout: ng.ITimeoutService) {
            this.init();
        }

        init(): void {
            angular.element("#TellAFriendDialogContainer").on("closed", () => {
                this.onTellAFriendPopupClosed();
            });
        }

        protected onTellAFriendPopupClosed(): void {
            this.resetPopup();
            this.$scope.$apply();
        }

        protected resetPopup(): void {
            this.tellAFriendModel = this.tellAFriendModel || {} as TellAFriendModel;
            this.tellAFriendModel.friendsName = "";
            this.tellAFriendModel.friendsEmailAddress = "";
            this.tellAFriendModel.yourName = "";
            this.tellAFriendModel.yourEmailAddress = "";
            this.tellAFriendModel.yourMessage = "";
            this.isSuccess = false;
            this.isError = false;
            this.inProgress = false;
        }

        shareWithFriend(): void {
            const valid = angular.element("#tellAFriendForm").validate().form();
            if (!valid) {
                return;
            }

            this.tellAFriendModel.productId = this.product.id.toString();
            this.tellAFriendModel.productImage = this.product.mediumImagePath;
            this.tellAFriendModel.productShortDescription = this.product.shortDescription;
            this.tellAFriendModel.altText = this.product.altText;
            this.tellAFriendModel.productUrl = this.product.productDetailUrl;

            this.inProgress = true;
            this.emailService.tellAFriend(this.tellAFriendModel).then(
                (tellAFriendModel: TellAFriendModel) => { this.tellAFriendCompleted(tellAFriendModel); },
                (error: any) => { this.tellAFriendFailed(error); });
        }

        protected tellAFriendCompleted(tellAFriendModel: TellAFriendModel): void {
            this.isSuccess = true;
            this.isError = false;
            this.inProgress = false;
            this.$timeout(() => {
                (angular.element("#TellAFriendDialogContainer") as any).foundation("reveal", "close");
            }, 1000);
        }

        protected tellAFriendFailed(error: any): void {
            this.isSuccess = false;
            this.isError = true;
            this.inProgress = false;
        }
    }

    angular
        .module("insite")
        .controller("TellAFriendController", TellAFriendController);
}