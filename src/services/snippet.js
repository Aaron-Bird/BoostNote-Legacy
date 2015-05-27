angular.module('codexen.services')
  .factory('Snippet', function ($http, $auth, apiUrl) {
    var findByUserId = function (userId) {
      var url = apiUrl + 'snippets'

      return $http.get(url, {
        params: {
          userId: userId
        }
      })
    }

    return {
      findByUserId: findByUserId
    }
  })
