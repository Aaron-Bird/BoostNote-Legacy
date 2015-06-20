/* global angular */
angular.module('codexen')
  .factory('Tag', function ($http, apiUrl) {
    var findByName = function (tagName) {
      var url = apiUrl + 'tags/search'

      return $http.get(url, {
        params: {
          name: tagName
        }
      })
    }

    return {
      findByName: findByName
    }
  })
