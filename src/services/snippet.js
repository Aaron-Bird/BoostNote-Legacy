angular.module('codexen.services')
  .factory('Snippet', function ($http, $auth, apiUrl) {
    var findByUser = function (user) {
      var url = apiUrl + 'snippets'

      return $http.get(url, {
        params: {
          user: user
        }
      })
    }

    var create = function (params) {
      var url = apiUrl + 'snippets'

      return $http.post(url, params)
    }

    var show = function (id) {
      var url = apiUrl + 'snippets/' + id

      return $http.get(url)
    }

    return {
      findByUser: findByUser,
      create: create,
      show: show
    }
  })
