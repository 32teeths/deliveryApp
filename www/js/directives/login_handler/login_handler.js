/*
 *
 *
 * Directive to add/edit address
 *
 *
 * */


(function () {

    function loginHandler($timeout) {

        return {
            restrict: 'A',
            templateUrl: 'js/directives/login_handler/login_handler.html',
            scope: {
                'auth': '=',
                'onLogin': '&'
            },
            controllerAs: 'loginh_ctrl',
            bindToController: true,
            controller: function (AuthService, $scope) {
                var self = this;

                /*Login with google*/
                self.loginWithGoogle = function () {
                    self.loading_google = true;
                    AuthService.loginWithGoogle().then(function (authData) {
                        self.auth = authData.uid;
                        /*add a delay to the function just to make sure everything else completes*/
                        $timeout(function () {
                            self.loading_google = false;
                            self.onLogin();
                        });
                    }).catch(function (error) {
                        console.error("Authentication failed:", error);
                    });
                }

                /*Login with facebeeok*/
                self.loginWithFacebook = function () {
                    self.loading_facebook = true;
                    AuthService.loginWithFacebook().then(function (authData) {
                        self.auth = authData.user.uid;
                        /*add a delay to the function just to make sure everything else completes*/
                        $timeout(function () {
                            self.loading_facebook = false;
                            self.onLogin();
                        });
                    }).catch(function (error) {
                        console.error("Authentication failed:", error);
                    });
                }


            }
        }
    }

    angular.module('app.services')
        .directive('loginHandler', loginHandler)
})();
