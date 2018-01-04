(function () {

    /*Controller for Account */
    function AccountCtrl(AuthService, ModalService, UserService, $timeout, ngProgressFactory, Auth) {

        var self = this;

        /*Authentication data resolved from config*/
        self.authData = Auth;

        /*Initialize Progress bar*/
        self.progressbar = ngProgressFactory.createInstance();

        /*Load account details*/
        self.loadAccount = function () {

            /*get auth object to watch authentication changes*/
            self.authObj = AuthService.getAuthObject();
            /*watch authentication changes*/
            self.authObj.$onAuthStateChanged(function (authData) {
                if (authData) {
                    self.account = authData.providerData[0];
                } else {
                    $timeout(function () {
                        self.account = null;
                        self.phone = '';
                        self.progressbar.complete();
                    }, 2000);
                }
            });

            /*get the phone number*/
            UserService.phoneNumber(self.authData).$loaded().then(function (snapshot) {
                self.phone = snapshot;
                /*if phone number is not set , get number*/
                if (!self.phone.$value) {
                    $timeout(function () {
                        self.updatePhoneNumber();
                    }, 1000);
                }
            });

        };

        /*If authenticaticated , get account details*/
        if (Auth) {
            self.loadAccount();
        }

        /*Update the phone number*/
        self.updatePhoneNumber = function () {
            ModalService.open('phone-number');
        };

        /*log out of the current logged in account . Timeout for few seconds*/
        self.logOut = function () {
            self.onAuth = AuthService.logOut();
            self.progressbar.start();
        };
    }

    angular.module('app.controllers')
        .controller('AccountCtrl', AccountCtrl);

    AccountCtrl.$inject = ['AuthService', 'ModalService', 'UserService', '$timeout', 'ngProgressFactory', 'auth'];

})();