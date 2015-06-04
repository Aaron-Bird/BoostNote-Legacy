/* global angular */
angular.module('codexen.popup')
  .constant('apiUrl', 'http://localhost:8000/')
  .config(function ($authProvider, $httpProvider) {
    $authProvider.baseUrl = 'http://localhost:8000/'

    $httpProvider.defaults.useXDomain = true
    delete $httpProvider.defaults.headers.common['X-Requested-With']
  })


angular.module('codexen.popup')
  .factory('Snippet', function ($http, apiUrl) {
    var findByUser = function (user) {
      var url = apiUrl + 'snippets/search'

      return $http.get(url, {
        params: {
          user: user
        }
      })
    }

    var create = function (params) {
      var url = apiUrl + 'snippets/create'

      return $http.post(url, params)
    }

    var show = function (id) {
      var url = apiUrl + 'snippets/id/' + id

      return $http.get(url)
    }

    var update = function (id, params) {
      var url = apiUrl + 'snippets/id/' + id

      return $http.put(url, params)
    }

    var destroy = function (id) {
      var url = apiUrl + 'snippets/id/' + id

      return $http.delete(url)
    }

    return {
      findByUser: findByUser,
      create: create,
      show: show,
      delete: destroy,
      update: update
    }
  })
