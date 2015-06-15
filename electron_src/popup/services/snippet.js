/* global angular */
angular.module('codexen.popup')
  .constant('apiUrl', 'http://localhost:8000/')
  .config(function ($authProvider, $httpProvider, apiUrl) {
    $authProvider.baseUrl = apiUrl

    $httpProvider.defaults.useXDomain = true
    delete $httpProvider.defaults.headers.common['X-Requested-With']
  })


angular.module('codexen.popup')
  .factory('Snippet', function ($http, $auth, apiUrl) {
    var findByUser = function (user) {
      var url = apiUrl + 'snippets/search'

      return $http.get(url, {
        params: {
          user: user
        }
      })
    }

    var findMine = function (params) {
      var url = apiUrl + 'snippets/my'

      return $http.get(url, {params: params})
    }

    var create = function (params) {
      var url = apiUrl + 'snippets/create'

      return $http.post(url, params)
    }

    var show = function (id, params) {
      var url = apiUrl + 'snippets/id/' + id

      return $http.get(url, {params: params})
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
      findMine: findMine,
      create: create,
      show: show,
      delete: destroy,
      update: update
    }
  })
