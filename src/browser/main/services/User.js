/* global angular */
angular.module('codexen')
  .factory('User', function ($http, apiUrl, $rootScope, $state) {
    $rootScope.$on('userSignOut', function () {
      $state.go('auth.signin')
    })

    var me = function () {
      var url = apiUrl + 'auth/user'
      return $http.get(url)
    }

    return {
      me: me
    }
  })
