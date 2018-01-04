(function () {

    /*Tab Contorller : Manages the modals used accros*/
    function TabCtrl(BasketService, ModalService, $scope, $rootScope) {

        var self = this;

        self.updateBasket = function(){
            self.basket = BasketService.get();
        }

        // on load check the localstorage to get if previous orders
        self.updateBasket();

        /*to update the count on the tab*/
        $rootScope.$on('updateBasketCount', function(){
            self.updateBasket();
        })


        /*the modals to load*/
        self.modals = ['phone-number', 'order-details'];

        /*load all the modals and bind it with $scope*/
        ModalService.initialize($scope, self);

        self.closeModal = function (modal) {
            ModalService.close(modal);
        }
    }

    TabCtrl.$inject = ['BasketService', 'ModalService', '$scope','$rootScope'];


    function LoginCtrl() {

    }

    /*Controller listing all cuisines*/
    function CuisineCtrl(ManageResource) {

        var _this = this;

        /*variable to set loading state true/false */
        _this.loading = true;

        /*variable to store the cuisines*/
        _this.cuisines = [];

        /*load the cuisine*/
        ManageResource.get('categories').$loaded().then(function (food) {
            _this.loading = false;
            _this.cuisines = food;
        });
    }

    CuisineCtrl.$inject = ['ManageResource'];

    /*Controller after cuisine is choosen*/
    function MenuCtrl(menu) {

        /*variable to check if there are no dishes in this category*/
        this.list_empty = false;

        /*if the length of menu is 0, list_empty is true*/
        if (menu.length == 0) {
            this.list_empty = true;
        }

        this.menu = menu;
    }

    MenuCtrl.$inject = ['menu'];


    function OrderStatusCtrl($stateParams, OrderResource, ModalService, $scope, $interval) {

        var self = this;

        self.progress = {};
        //self.progress.max = 0;
        // self.progress.current = 0;

        /*Load the order with order_id*/
        OrderResource.getById($stateParams.order_id).$loaded().then(function (snapshot) {
            self.order = snapshot;
            self.progress.current = snapshot.time;
            self.progress.max = +new Date(snapshot.time + (40 * 60000));
            //$interval(function countDown() {
            //    self.progress.current++;
            //    console.log(+new Date());
            //}, 1000);
        });

        self.viewOrder = function () {
            ModalService.open(self, 'order-details');
        };

        self.closeOrder = function () {
            ModalService.close(self, 'order-details');
        };
    }

    OrderStatusCtrl.$inject = ['$stateParams', 'OrderResource', 'ModalService', '$scope', '$interval'];

    /*Controller specific to the phone number modal*/
    function PhoneCtrl(ModalService, AuthService, UserService) {

        var self = this;

        // if (AuthService.getAuth()) {
        //     UserService.phoneNumber().$loaded().then(function (snapshot) {
        //         self.phone = snapshot;
        //     });
        // }

        /*update the accound holders phone number*/
        self.saveNumber = function () {
            self.phone.$save().then(function (snapshot) {
                ModalService.close('phone-number');
            });
        };

        /*close the modal*/
        self.closePhoneNumber = function () {
            ModalService.close('phone-number');
        };
    }


    function MapCtrl($scope, SharedService, $state,UserService, StreetService,auth) {
        var self = this;

        /*variable to check if map is loaded*/
        self.map_loaded = false;

        /*variable to store coords and street address*/
        self.street = {
            coords: {},
            formatted_address: '',
            address_type:'map'
        };


        self.confirmLocation = function () {

            SharedService.setValue('map-coords', {lat: self.lat, long: self.long});
            self.street.coords = {lat: self.lat, long: self.long};
            StreetService.getStreet(self.lat, self.long).then(function (street) {
                self.street.formatted_address = street.data.results[0].formatted_address;
                UserService.address(auth).$add(self.street).then(function (snapshot) {
                    $state.go('tab.address');
                });
            });
        };

        self.mapCreated = function (map) {
            self.map_loaded = true;
            $scope.map = map;
        };
    }

    angular.module('app.controllers', [])

        .controller('TabCtrl', TabCtrl)
        .controller('LoginCtrl', LoginCtrl)
        .controller('CuisineCtrl', CuisineCtrl)
        .controller('MapCtrl', MapCtrl)
        .controller('MenuCtrl', MenuCtrl)
        .controller('PhoneCtrl', PhoneCtrl)
        .controller('OrderStatusCtrl', OrderStatusCtrl);

})();
