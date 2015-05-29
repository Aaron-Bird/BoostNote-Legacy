angular.module('codexen.services')
  .factory('Snippet', function ($http, $auth, apiUrl) {
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

    var destroy = function (id) {
      var url = apiUrl + 'snippets/id/' + id

      return $http.delete(url)
    }

    return {
      findByUser: findByUser,
      create: create,
      show: show,
      delete: destroy
    }
  })
