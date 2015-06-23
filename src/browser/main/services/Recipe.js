/* global angular */
angular.module('codexen')
  .factory('Recipe', function ($http, $auth, apiUrl) {
    var findByUser = function (user) {
      var url = apiUrl + 'recipes/search'

      return $http.get(url, {
        params: {
          user: user
        }
      })
    }

    var findMine = function (params) {
      var url = apiUrl + 'recipes/my'

      return $http.get(url, {params: params})
    }

    var create = function (params) {
      var url = apiUrl + 'recipes/create'

      return $http.post(url, params)
    }

    var show = function (id, params) {
      var url = apiUrl + 'recipes/id/' + id

      return $http.get(url, {params: params})
    }

    var update = function (id, params) {
      var url = apiUrl + 'recipes/id/' + id

      return $http.put(url, params)
    }

    var destroy = function (id) {
      var url = apiUrl + 'recipes/id/' + id

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
