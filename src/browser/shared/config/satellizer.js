/* global angular */
angular.module('codexen.shared')
  .config(function ($authProvider, $httpProvider, apiUrl, appName) {
    $authProvider.baseUrl = apiUrl

    $httpProvider.defaults.useXDomain = true
    delete $httpProvider.defaults.headers.common['X-Requested-With']
    $httpProvider.interceptors.push(function ($q, $injector) {
      return {
        responseError: function (res) {
          switch (res.status) {
            case 401:
              switch (appName) {
                case 'main' :
                  var $state = $injector.get('$state')
                  $state.go('auth.signin')
                  break
                case 'popup' :
                  // TODO: hide popup
                  break
              }
              break
          }

          return $q.reject(res)
        }
      }
    })
  })
