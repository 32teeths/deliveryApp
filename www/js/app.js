angular.module('sagarDelivery', ['ionic', 'app.controllers', 'app.services', 'firebase', 'angular-svg-round-progress', 'ngProgress', 'ngCordova', 'ngCordovaOauth'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
            // Ionic.io();

            // var push = new Ionic.Push({
            //   "debug": true
            // });
            // push.register(function(token) {
            //   console.log("Device token:",token.token);
            // });
        });
    })
    .run(function ($rootScope, $ionicLoading, ngProgressFactory) {

        $rootScope.progressbar = ngProgressFactory.createInstance();
        $rootScope.$on('loading:show', function () {
            $rootScope.progressbar.start();

            // ModalService.open(this,'loading');
            // $ionicLoading.show({templateUrle: 'templates/modals/loading.html'});
        });

        $rootScope.$on('loading:hide', function () {
            // $ionicLoading.hide();
            $rootScope.progressbar.complete();

            // ModalService.close(self,'loading');

        });
    })


    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {


        var config = {
            apiKey: "AIzaSyC3Jl5iYRRbk1DBUDBZ6_t54cDMe0lD74w",
            authDomain: "sagar.firebaseapp.com",
            databaseURL: "https://sagar.firebaseio.com",
            storageBucket: "firebase-sagar.appspot.com",
        };


        firebase.initializeApp(config);


        $httpProvider.interceptors.push(function ($rootScope) {
            return {
                request: function (config) {
                    $rootScope.$broadcast('loading:show');
                    return config;
                },
                //hide loading in case any occurred
                requestError: function (response) {
                    $rootScope.$broadcast('loading:hide');
                    return response;
                },
                //Hide loading once got response
                response: function (response) {
                    $rootScope.$broadcast('loading:hide');
                    return response;
                },
                //Hide loading if got any response error
                responseError: function (response) {
                    $rootScope.$broadcast('loading:hide');
                    return response;
                }
            };
        });

        $stateProvider
            // Parent State Wraps the tabs of the app 
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                controller: 'TabCtrl as tabctrl'
            })

            // Login page : not used
            .state('tab.login', {
                url: '/login',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/account/tab-account.html',
                        controller: 'MoreCtrl as morectrl'
                    }
                }
            })
            // Cuisines to choose from 
            .state('tab.cuisine', {
                url: '/cuisine',
                views: {
                    'tab-cuisine': {
                        templateUrl: 'templates/menu/tab-cuisine.html',
                        controller: 'CuisineCtrl as cuisinectrl'
                    }
                }
            })
            // Menu of the particular cuisine
            .state('tab.menu', {
                url: '/menu/:cuisine',
                resolve: {
                    menu: function ($stateParams, ListMenuResource) {
                        return ListMenuResource.byField($stateParams.cuisine).$loaded();
                    }
                },
                views: {
                    'tab-cuisine': {
                        templateUrl: 'templates/menu/tab-menu.html',
                        controller: 'MenuCtrl as menuctrl'
                    }
                }
            })
            // Item of the Menu
            .state('tab.item', {
                url: '/item/:item_id',
                views: {
                    'tab-cuisine': {
                        templateUrl: 'templates/menu/tab-item.html',
                        controller: 'ItemCtrl as itemctrl'
                    }
                }
            })
            // Orders Page
            .state('tab.orders', {
                url: '/orders',
                resolve: {
                    auth: function (AuthService) {
                        return AuthService.getAuth() || false;
                    }
                },
                views: {
                    'tab-orders': {
                        templateUrl: 'templates/orders/tab-orders.html',
                        controller: 'OrdersCtrl as ordersctrl',
                    }
                }
            })

                   // Order status of the particular order
            .state('tab.order-status', {
                url: '/orders/:order_id',
                views: {
                    'tab-orders': {
                        templateUrl: 'templates/orders/order-status.html',
                        controller: 'OrderStatusCtrl as orderstatusctrl'
                    }
                }
            })
            // Accounts Page
            .state('tab.account', {
                url: '/account',
                resolve: {
                    auth: function (AuthService) {
                        return AuthService.getAuth() || false;
                    }
                },
                views: {
                    'tab-account': {
                        templateUrl: 'templates/account/tab-account.html',
                        controller: 'AccountCtrl as accountctrl'
                    }
                }
            })
            // Address page , list the addresss
            .state('tab.address', {
                url: '/address',
                resolve: {
                    auth: function (AuthService) {
                        return AuthService.getAuth() || false;
                    }
                },
                views: {
                    'tab-account': {
                        templateUrl: 'templates/account/address-list.html',
                        controller: 'AddressCtrl as addressctrl'
                    }
                }
            })
            // Shows the map to select an address
            .state('tab.map', {
                url: '/map',
                resolve: {
                    auth: function (AuthService) {
                        return AuthService.getAuth() || false;
                    }
                },
                views: {
                    'tab-account': {
                        templateUrl: 'templates/account/map.html',
                        controller: 'MapCtrl as mapctrl'
                    }
                }
            })
            // New address page , for creating, if id is present it is edit
            .state('tab.newaddress', {
                url: '/address/new/:id',
                views: {
                    'tab-account': {
                        templateUrl: 'templates/account/address-new.html',
                        controller: 'AddressCtrl as addressctrl'
                    }
                },
                resolve: {
                    auth: function (AuthService) {
                        return AuthService.getAuth() || false;
                    }
                },

            })
            // Cart or the basket : of the selected items
            .state('tab.basket', {
                url: '/basket',
                resolve: {
                    food: function (BasketService) {
                        return BasketService.get();
                    }
                },
                views: {
                    'tab-basket': {
                        templateUrl: 'templates/basket/tab-basket.html',
                        controller: 'BasketCtrl as basketctrl',
                    }
                }
            })
            // Select address for the order, confirm and then you are ready 
            .state('tab.select-address', {
                url: '/order/address',
                resolve: {
                    auth: function (AuthService) {
                        return AuthService.getAuth() || false;
                    }
                },
                views: {
                    'tab-basket': {
                        templateUrl: 'templates/basket/select-address.html',
                        controller: 'CheckoutCtrl as checkoutctrl'
                    }
                }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/cuisine');

    });
