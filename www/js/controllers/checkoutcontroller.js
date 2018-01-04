
(function(){

    /*Controller for Basket*/
    function CheckoutCtrl(BasketService,$state,UserService,SharedService,ModalService,ngProgressFactory,auth){

        var self = this;

        /*auth data resolved*/
        self.authData = auth;

        /*variable to store the order*/
        self.order = SharedService.getValue('order');

        /*initialize the progress bar*/
        self.progressbar = ngProgressFactory.createInstance();

        /*loading state*/
        self.loading = true;

        /*load account details*/
        self.loadAccount = function(){
            /*load the phone number*/
            UserService.phoneNumber(auth).$loaded().then(function(snapshot){
                self.order.phone = snapshot;
            });

            /*load the address list*/
            UserService.address(auth).$loaded().then(function(snapshot){
                self.addresslist = snapshot;
                self.order.selected_address = self.addresslist[0];
                self.loading = false;
            });

        };

        /*If authenticated , load details*/
        if(auth){
            self.loadAccount();
        }

        /*Confirm Order*/
        self.confirmOrder = function(){
            self.progressbar.start();
            
            console.log(auth);

            BasketService.confirmOrder(self.order, self.authData).then(function(result){
                console.log(result);
                self.progressbar.complete();
                self.basket = [];
                $state.go('tab.orders');
            });
        };

        /*Open phone number modal*/
        self.updatePhoneNumber = function(){
            ModalService.open('phone-number');
        };

        /*Save the phone number*/
        self.saveNumber = function(){
            self.order.phone.$save().then(function(snapshot){
                ModalService.close(self,'phone-number');
            });
        };
    }

    angular.module('app.controllers')
        .controller('CheckoutCtrl',CheckoutCtrl);

})();