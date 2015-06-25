/* global angular */
angular.module('codexen')
  .controller('AuthSignInController', function ($auth, $rootScope) {
    var vm = this

    vm.authFailed = false

    vm.signIn = function () {
      vm.authFailed = false
      $auth.login({
        email: vm.email,
        password: vm.password
      }).then(function (data) {
        console.log(data)
        $rootScope.$broadcast('userSignIn')
      }, function (err) {
        console.log(err)
        vm.authFailed = true
      })
    }
  })
