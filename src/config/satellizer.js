/* global angular */
angular.module('codexen.config')
  .constant('apiUrl', 'http://localhost:8000/')
  .config(function ($authProvider, $httpProvider) {
    $authProvider.baseUrl = 'http://localhost:8000/'

    $httpProvider.defaults.useXDomain = true
    delete $httpProvider.defaults.headers.common['X-Requested-With']
  })
