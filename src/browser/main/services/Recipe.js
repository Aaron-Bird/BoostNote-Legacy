/* global angular */
angular.module('codexen')
  .factory('Recipe', function ($http, $auth, apiUrl) {
    var findByUser = function (user) {
      var url = apiUrl + 'blueprints/search'

      return $http.get(url, {
        params: {
          user: user
        }
      })
    }

    var findMine = function (params) {
      var url = apiUrl + 'blueprints/my'

      return $http.get(url, {params: params})
    }

    var create = function (params) {
      var url = apiUrl + 'blueprints/create'

      return $http.post(url, params)
    }

    var show = function (id, params) {
      var url = apiUrl + 'blueprints/id/' + id

      return $http.get(url, {params: params})
    }

    var update = function (id, params) {
      var url = apiUrl + 'blueprints/id/' + id

      return $http.put(url, params)
    }

    var destroy = function (id) {
      var url = apiUrl + 'blueprints/id/' + id

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
