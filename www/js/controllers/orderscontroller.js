(function () {

    function OrdersCtrl(OrderService, Auth, $scope) {

        var self = this;

        /*loading state on/off*/
        self.loading = true;

        /*variable to store orders*/
        self.orders = [];

        /*Get the resolved authentication data*/
        self.authData = Auth;

        /*Load the orders*/
        self.loadOrders = function () {
            self.loading = true;

            OrderService.getOrders(self.authData.uid).$loaded().then(function (snapshot) {
                /*Show only recent orders*/
                snapshot = snapshot.filter(function (order) {
                    var order_time = new Date(order.time);
                    var time_now = +new Date();
                    return ((time_now - order_time) / (3600000 * 24) < 2)
                });
                self.orders = snapshot;
                self.loading = false;
            });
        };

        /*Get the orders*/
        if (Auth) {
            self.loadOrders();
        } else {
            self.loading = false;
        }
    }

    angular.module('app.controllers')
        .controller('OrdersCtrl', OrdersCtrl);

    OrdersCtrl.$inject = ['OrderService', 'auth', '$scope'];

})();
