(function () {

    function AddressCtrl($stateParams, UserService, LocationService, SharedService, StreetService, auth) {

        var self = this;

        /*if the address modal is in edit mode/not*/
        self.editMode = false;

        /*variable to confirm that the address type is selected*/
        self.type_selected = false;

        /*load the address of the current user*/
        UserService.address(auth).$loaded().then(function (snapshot) {
            console.log(snapshot);
            self.addresslist = snapshot;
        });

        /*if on the edit address page , set the param for directive*/
        if ($stateParams.id) {
            self.editMode = true;
            self.address_id = $stateParams.id;
        }

        /*if there is value got from map*/
        if (SharedService.getValue('map-coords')) {
            console.log(SharedService.getValue('map-coords'));
        }

        /*choose type of address*/
        self.chooseType = function (bool) {
            self.type_selected = true;
            self.manual = bool;
        };

        /*find location using gps*/
        self.findLocation = function () {

            self.manual = false;
            self.finding_location = true;
            LocationService.getPosition().then(
                function (result) {
                    StreetService.getStreet(result.latitude, result.longitude).then(function (street) {
                        self.finding_location = false;
                        console.log(street);
                        var data = {
                            address_type: 'gps',
                            coords: { lat: result.latitude, long: result.longitude },
                            formatted_address: street.data.results[0].formatted_address
                        };

                        console.log(data);
                        self.addresslist.$add(data).then(function (snapshot) {
                            //$ionicHistory.goBack();
                        });


                        console.log(street);
                    });
                }, function (error) {
                    console.log(error);
                });
        }
    }

    AddressCtrl.$inject = ['$stateParams', 'UserService', 'LocationService', 'SharedService', 'StreetService','auth'];

    angular.module('app.controllers')
        .controller('AddressCtrl', AddressCtrl)
})();