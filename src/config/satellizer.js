/* global angular */
angular.module('codexen')
  .config(function ($authProvider, $httpProvider, apiUrl) {
    $authProvider.baseUrl = apiUrl

    $httpProvider.defaults.useXDomain = true
    delete $httpProvider.defaults.headers.common['X-Requested-With']
    $httpProvider.interceptors.push(function ($q, $injector) {
      return {
        responseError: function (res) {
          switch (res.status) {
            case 401:
              var $state = $injector.get('$state')
              $state.go('auth.signin')
              break
          }

          return $q.reject(res)
        }
      }
    })
  })
