/* global angular */
angular.module('codexen')
  .controller('AuthSignInController', function ($auth, $rootScope) {
    var vm = this

    vm.signIn = function () {
      $auth.login({
        email: vm.email,
        password: vm.password
      }).then(function (data) {
        console.log(data)
        $rootScope.$broadcast('userSignIn')
      })
    }
  })
