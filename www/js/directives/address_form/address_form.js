/*
 *
 *
 * Directive to add/edit address
 *
 *
 * */


(function () {

    function addressForm() {

        return {
            restrict: 'A',
            templateUrl: 'js/directives/address_form/address_form.html',
            scope: {
                'editMode': '=',
                'addressList': '=',
                'addressId': '='
            },
            controllerAs: 'newaddress_ctrl',
            bindToController: true,
            controller: function ($ionicHistory) {
                var self = this;


                /*Check if editMode is true,if yes get the address object*/
                if (self.editMode) {
                    self.addressObj = self.addressList.$getRecord(self.addressId);
                    self.addressForm = self.addressObj.address;
                } else {
                    /*Object to save new address*/
                    self.addressForm = {};
                }

                /*Save the Updates*/
                self.save_changes = function () {
                    if (!self.editMode) {
                        var data = {
                            address_type: 'manual',
                            address: self.addressForm,
                            formatted_address: self.addressForm
                        };
                        /*add the new address to address list*/
                        self.addressList.$add(data).then(function (snapshot) {
                            $ionicHistory.goBack();
                        });

                    } else {

                        /*Save the updates to the address*/
                        self.addressList.$save(self.addressObj).then(function (snapshot) {
                            $ionicHistory.goBack();
                        }, function (error) {
                            console.log(error);
                        });
                    }
                };

                self.delete_address = function () {
                    self.addressList.$remove(self.addressForm).then(function (snapshot) {
                        $ionicHistory.goBack();
                    })

                }
            }
        }
    }

    angular.module('app.services')
        .directive('addressForm', addressForm)
})();