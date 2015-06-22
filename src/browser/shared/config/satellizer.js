/* global angular */
angular.module('codexen.shared')
  .config(function ($authProvider, $httpProvider, apiUrl) {
    $authProvider.baseUrl = apiUrl

    $httpProvider.defaults.useXDomain = true
    delete $httpProvider.defaults.headers.common['X-Requested-With']
  })
