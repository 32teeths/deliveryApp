(function () {

    /*Controller for viewing item , add to basket */
    function ItemCtrl($stateParams, ManageResource, DishResource, BasketService, $ionicHistory) {

        var self = this;

        self.order = {
            dish_name: '',
            dish_id: '',
            dish_price: 0,
            dish_category: '',
            dish_quantity: 1
        };

        self.multiple_price = false;

        /*Get the record*/
        DishResource.getRecord($stateParams.item_id).$loaded().then(function (snapshot) {

            if (snapshot.varieties) {
                self.multiple_price = true;
                self.multiple_choices = snapshot.varieties;
                self.order.selected_choice = snapshot.varieties[snapshot.varieties.length - 1];
                self.order.dish_price = self.order.selected_choice.dish_price * self.order.dish_quantity;

            } else {
                self.order.dish_price = snapshot.dish_price;
            }

            self.order.dish_name = snapshot.dish_name;
            self.order.dish_id = snapshot.$id;
            self.order.dish_category = snapshot.dish_category;
        });

        // add Quantity
        self.addQuantity = function () {
            self.order.dish_quantity++;
        };

        // reduce Quantity
        self.reduceQuantity = function () {
            self.order.dish_quantity = self.order.dish_quantity === 1 ? self.order.dish_quantity : self.order.dish_quantity - 1;
        };

        // add to basket
        self.addtoBasket = function () {
            BasketService.add(self.order);
            $ionicHistory.goBack();
        };
    }

    angular.module('app.controllers')
        .controller('ItemCtrl', ItemCtrl);

})();