(function () {


    function BasketService($localStorage, OrderResource, $rootScope) {

        var self = this;
        self.items = angular.isArray($localStorage.getObject('basket')) ? $localStorage.getObject('basket') : [];


        return {
            'add': function (order) {
                var duplicate = false;
                /*check if the basket the item already*/
                self.items = self.items.map(function (item) {
                    if (item.dish_id == order.dish_id) {
                        duplicate = true;
                        item.dish_quantity += order.dish_quantity;
                    }
                    return item;
                });
                if (!duplicate) {
                    self.items.push(order);
                }
                $rootScope.$emit('updateBasketCount');
                $localStorage.setObject('basket', self.items);
            },
            'confirmOrder': function (order, auth) {
                // self.items = [];
                return OrderResource.confirm(order, auth);
            },
            'get': function () {
                return self.items;
            },
            'clear': function () {
                self.items = [];
                $localStorage.clearObject('basket');
                $rootScope.$emit('updateBasketCount');
            }

        };

    }

    function UserService($firebaseArray, FirebaseResource, $firebaseObject, AuthService) {

        var self = this;

        return {
            'address': function (auth) {
                return $firebaseArray(FirebaseResource.route('accounts').child(auth.uid).child('address'));
            },
            'phoneNumber': function (auth) {
                return $firebaseObject(FirebaseResource.route('accounts').child(auth.uid).child('phone'));
            }
        };
    }

    function AuthService(FirebaseResource, $firebaseAuth, $firebaseArray, $q, $cordovaOauth) {

        var self = this;
        self.auth = $firebaseAuth();
        self.custom_auth = firebase.auth();
        return {
            'loginWithGoogle': function () {
                return self.auth.$signInWithRedirect('google')
                    .then(function (result) {
                        return $q.when(result.user)
                    })
                    .catch(function (error) {
                        return $cordovaOauth.google("485705914176-3djfbpqrs7b6jnm313le0auulsro658e.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"], {
                            redirect_uri: 'http://localhost:8100/orders/'
                        }).then(function (result) {
                            var credential = new firebase.auth.GoogleAuthProvider.credential(result.id_token, result.access_token);
                            return firebase.auth().signInWithCredential(credential).then(function (result) {
                                return result;
                            }).catch(function (error) {
                                return error;
                            })
                        })
                    })
            },

            'loginWithFacebook': function () {
                return self.auth.$signInWithPopup('facebook').then(function (result) {
                    return $q.when(result)
                }).catch(function (error) {
                    return self.auth.$signInWithRedirect("facebook");
                })
            },
            'getAuth': function () {
                return self.auth.$waitForSignIn();
            },
            'logOut': function () {
                return self.auth.$signOut();
            },
            'getAuthObject': function () {
                return self.auth;
            },
            'getAuthDetails': function () {
                console.log(self.auth);
                return self.auth.$getAuth();
            }

        };
    }


    function $localStorage($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            clearObject: function (key) {
                $window.localStorage.removeItem(key);

            }
        };
    }


    function ModalService($ionicModal) {

        var self = this;

        self.modal = [];

        this.initialize = function ($scope, parent) {

            self.modal = Array();

            angular.forEach(parent.modals, function (k) {
                $ionicModal.fromTemplateUrl('templates/modals/' + k + '.html', function (modal) {
                    self.modal[k] = modal;
                },
                    {
                        scope: $scope,
                        animation: 'slide-in-up'
                    });
            });

            $scope.$on('modal.shown', function () {

            });

            //Cleanup the modal when we're done wi  th it!
            $scope.$on('$destroy', function () {
                //$scope.modal.remove();
            });
            // Execute action on hide modal
            $scope.$on('modal.hidden', function () {
                // Execute action
            });
            // Execute action on remove modal
            $scope.$on('modal.removed', function () {
                // Execute action
            });

        };

        this.open = function (k) {
            self.modal[k].show();
        };

        this.close = function (k) {
            self.modal[k].hide();
        };
    }


    function SharedService() {
        this.obj = [];

        this.setValue = function (key, value) {
            this.obj[key] = value;
        };

        this.getValue = function (key) {
            return this.obj[key];
        };
    }


    function LocationService($cordovaGeolocation, StreetService) {
        var self = this;

        return {
            getPosition: function () {

                var posOptions = { timeout: 10000, enableHighAccuracy: false };
                return $cordovaGeolocation
                    .getCurrentPosition(posOptions)
                    .then(function (position) {
                        //return StreetService.getStreet(position.coords.latitude, position.coords.longitude);
                        return position.coords;
                    }, function (err) {
                        // error
                        console.log(err);
                    });
            }
        };
    }


    function StreetService($http) {

        return {
            getStreet: function (lat, long) {
                return $http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=AIzaSyBEGndynfBER-TgT4Y0C8uzMXWEPDqXb3I');
            }
        }
    }


    function map(LocationService) {
        return {
            restrict: 'E',
            scope: {
                onCreate: '&',
                lat: '=',
                long: '='
            },
            link: function ($scope, $element) {

                var lat, long;

                function initialize(lat, long) {
                    lat = lat || -34.397;
                    long = long || 150.644;

                    var mapOptions = {
                        center: new google.maps.LatLng(lat, long),
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        mapTypeControl: false,
                        streetViewControl: false
                    };
                    var map = new google.maps.Map($element[0], mapOptions);

                    $scope.onCreate({ map: map });

                    $scope.lat = map.getCenter().lat();
                    $scope.long = map.getCenter().lng();

                    /*once the center is changed find that location*/
                    map.addListener('dragend', function () {
                        $scope.lat = map.getCenter().lat();
                        $scope.long = map.getCenter().lng()
                    });

                    // Stop the side bar from dragging when mousedown/tapdown on the map
                    google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
                        e.preventDefault();
                        return false;
                    });
                }

                LocationService.getPosition().then(function (coords) {
                    initialize(coords.latitude, coords.longitude);
                });

            }
        }
    }


    angular.module('app.services', [])
        .service('ModalService', ModalService)
        .factory('LocationService', LocationService)
        .factory('BasketService', BasketService)
        .factory('StreetService', StreetService)
        .factory('UserService', UserService)
        .service('SharedService', SharedService)
        .factory('$localStorage', $localStorage)
        .directive('map', map)
        .factory('AuthService', AuthService);

})();
