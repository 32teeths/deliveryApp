(function () {

    /*Controller for Basket*/
    function BasketCtrl(BasketService, AuthService, $state, UserService, SharedService, ModalService, $timeout, ngProgressFactory, food) {

        var self = this;

        /*initialize the progress bar*/
        self.progressbar = ngProgressFactory.createInstance();

        /*variable to store the order*/
        self.order = {};

        /*get the items stored in local*/
        self.order.basket = food;

        /*for the type of delivery: 0 for Pickup and 1 for Home Delivery*/
        self.order.delivery_type = 0;

        /*to calculate the total of items in basket*/
        self.order.total = 0;

        /*find the total of the order*/
        angular.forEach(self.order.basket, function (value, key) {
            self.order.total += value.dish_price * value.dish_quantity;
        });

        /*Go to checkout page*/
        self.checkout = function () {
            SharedService.setValue('order', self.order);
            $state.go('tab.select-address');
        };

        /*Clear the basket*/
        self.clearBasket = function () {
            self.progressbar.start();
            //$timeout(function () {
            BasketService.clear();
            self.order = {};
            self.progressbar.complete();
            //}, 3000);
        };
    }

    angular.module('app.controllers')
        .controller('BasketCtrl', BasketCtrl);

    BasketCtrl.$inject = ['BasketService', 'AuthService', '$state', 'UserService', 'SharedService', 'ModalService', '$timeout', 'ngProgressFactory', 'food'];

})();