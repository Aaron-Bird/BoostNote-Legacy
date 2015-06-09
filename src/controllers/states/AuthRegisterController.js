/* global angular */
angular.module('codexen')
  .controller('AuthRegisterController', function ($auth, $log, $state, $rootScope) {
    var vm = this
    vm.isEmpty = function (obj) {
      for (var i in obj) if (obj.hasOwnProperty(i)) return false
      return true
    }
    vm.signup = function () {
      $auth.signup({
        email: vm.email,
        password: vm.password,
        name: vm.name,
        profileName: vm.profileName
      }).then(function (data) {
        $rootScope.$broadcast('userSignIn')
        $state.go('home')
      })
    }
  })
