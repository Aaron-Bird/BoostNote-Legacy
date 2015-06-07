/* global angular */
angular.module('codexen')
  .directive('btnEditSnippet', function (Modal, $rootScope) {
    return {
      scope: {
        snippet: '=btnEditSnippet'
      },
      link: function (scope, el) {
        el.on('click', function () {
          Modal.editSnippet(scope.snippet)
            .result.then(function (snippet) {
              $rootScope.$broadcast('snippetUpdated', snippet)
            }, function () {
              console.log('edit snippet modal dismissed')
            })
        })
      }
    }
  })
