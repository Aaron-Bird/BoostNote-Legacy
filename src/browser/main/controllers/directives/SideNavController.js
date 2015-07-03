/* global angular */
angular.module('codexen')
  .controller('SideNavController', function ($auth, User, $rootScope, $scope, Modal) {
    var vm = this

    vm.isAuthenticated = $auth.isAuthenticated()

    vm.showPP = Modal.showPP
    vm.showRegulation = Modal.showRegulation

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
      Modal.signOut()
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
