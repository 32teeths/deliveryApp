(function () {

    function OrderService(OrderResource) {

        this.getOrders = function (auth) {
            return OrderResource.listByUser(auth);
        }
    }

    angular.module('app.services')
        .service('OrderService', OrderService)

})();
