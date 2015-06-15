/* global angular */
angular.module('codexen')
  .factory('Settings', function ($http, apiUrl) {
    var changePassword = function (params) {
      var url = apiUrl + 'settings/change_password'

      return $http.post(url, params)
    }

    return {
      changePassword: changePassword
    }
  })
