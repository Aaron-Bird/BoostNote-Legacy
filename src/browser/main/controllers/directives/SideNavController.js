/* global angular */
angular.module('codexen')
  .controller('SideNavController', function ($auth, User, $rootScope, $scope) {
    var vm = this

    vm.isAuthenticated = $auth.isAuthenticated()

    var reloadUser = function () {
      if (vm.isAuthenticated) {
        User.me().success(function (data) {
          console.log('currentUser', data)
          vm.currentUser = data
        })
      }
    }
    reloadUser()

    vm.signOut = function () {
      $auth.logout()
        .then(function () {
          console.log('Sign Out')
          $rootScope.$broadcast('userSignOut')
        })
    }

    $scope.$on('userSignIn', function () {
      vm.isAuthenticated = true
      reloadUser()
    })

    $scope.$on('userSignOut', function () {
      vm.isAuthenticated = false
      vm.currentUser = null
    })
  })
