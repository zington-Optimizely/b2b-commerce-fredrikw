module insite.wishlist {
    "use strict";

    export class CopyToListPopupController {
        errorMessage: string;
        newListName: string;
        selectedList: WishListModel;
        copyToListCompleted: boolean;
        copyInProgress: boolean;
        listCollection: WishListModel[];
        showListNameErrorMessage: boolean;
        mylistDetailModel: WishListModel;
        listName: string;

        static $inject = ["wishListService", "coreService", "copyToListPopupService"];

        constructor(
            protected wishListService: IWishListService,
            protected coreService: core.ICoreService,
            protected copyToListPopupService: ICopyToListPopupService) {
            this.init();
        }

        init(): void {
            this.initializePopup();
        }

        protected closeModal(): void {
            this.coreService.closeModal("#popup-copy-list");
        }

        initializePopup(): void {
            this.copyToListPopupService.registerDisplayFunction((list: WishListModel) => {
                this.mylistDetailModel = list;
                this.coreService.displayModal(angular.element("#popup-copy-list"));
                const pagination = { pageSize: 999 } as PaginationModel;
                this.clearMessages();
                this.newListName = "";
                this.wishListService.getWishLists(null, null, null, pagination).then(
                    (listCollection: WishListCollectionModel) => { this.getListCollectionCompleted(listCollection); },
                    (error: any) => { this.getListCollectionFailed(error); });
            });
        }

        protected getListCollectionCompleted(listCollection: WishListCollectionModel): void {
            this.listCollection = listCollection.wishListCollection.filter(o => o.id !== this.mylistDetailModel.id);
        }

        protected getListCollectionFailed(error: any): void {
            this.errorMessage = error.message;
        }

        clearMessages(): void {
            this.copyInProgress = false;
            this.copyToListCompleted = false;
            this.errorMessage = "";
            this.showListNameErrorMessage = false;
        }

        changeList(): void {
            this.newListName = "";
            this.clearMessages();
        }

        addList(listName: string): void {
            this.wishListService.addWishList(listName).then(
                (list: WishListModel) => { this.addListCompleted(list); },
                (error: any) => { this.addListFailed(error); });
        }

        protected addListCompleted(list: WishListModel): void {
            this.addProductsToList(list);
        }

        protected addListFailed(error: any): void {
            this.errorMessage = error.message;
            this.copyInProgress = false;
        }

        copyToList(): void {
            this.clearMessages();
            this.copyInProgress = true;
            if (this.selectedList) {
                this.listName = this.selectedList.name;
                this.addProductsToList(this.selectedList);
            } else {
                if (this.newListName && this.newListName.trim().length > 0) {
                    this.listName = this.newListName;
                    this.addList(this.newListName);
                } else {
                    this.showListNameErrorMessage = true;
                    this.copyInProgress = false;
                }
            }
        }

        protected addProductsToList(list: WishListModel): void {
            if (this.mylistDetailModel.wishListLinesCount === 1) {
                this.addLineToList(list);
            } else {
                this.addLineCollectionToList(list);
            }
        }

        protected addLineToList(list: WishListModel): void {
            this.wishListService.addWishListLine(list, this.wishListService.mapWishListLinesToProducts(this.mylistDetailModel.wishListLineCollection)[0]).then(
                (listLine: WishListLineModel) => { this.addListLineCompleted(listLine); },
                (error: any) => { this.addListLineFailed(error); });
        }

        protected addListLineCompleted(listLine: WishListLineModel): void {
            this.copyToListCompleted = true;
        }

        protected addListLineFailed(error: any): void {
            this.errorMessage = error.message;
            this.copyInProgress = false;
        }

        protected addLineCollectionToList(list: WishListModel): void {
            this.wishListService.addWishListLines(list, this.wishListService.mapWishListLinesToProducts(this.mylistDetailModel.wishListLineCollection)).then(
                (listLineCollection: WishListLineCollectionModel) => { this.addListLineCollectionCompleted(listLineCollection); },
                (error: any) => { this.addListLineCollectionFailed(error); });
        }

        protected addListLineCollectionCompleted(listLineCollection: WishListLineCollectionModel): void {
            this.copyToListCompleted = true;
        }

        protected addListLineCollectionFailed(error: any): void {
            this.errorMessage = error.message;
            this.copyInProgress = false;
        }
    }

    export interface ICopyToListPopupService {
        display(data: any): void;
        registerDisplayFunction(p: (data: any) => void);
    }

    export class CopyToListPopupService extends base.BasePopupService<any> implements ICopyToListPopupService {
        protected getDirectiveHtml(): string {
            return "<isc-copy-to-list-popup></isc-copy-to-list-popup>";
        }
    }

    angular
        .module("insite")
        .controller("CopyToListPopupController", CopyToListPopupController)
        .service("copyToListPopupService", CopyToListPopupService)
        .directive("iscCopyToListPopup", () => ({
            restrict: "E",
            replace: true,
            templateUrl: "/PartialViews/List-CopyToListPopup",
            controller: "CopyToListPopupController",
            controllerAs: "vm",
            bindToController: true
        }));
}