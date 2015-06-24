/* global angular */
angular.module('codexen')
  .directive('btnDeleteSnippet', function (Modal, $rootScope) {
    return {
      scope: {
        snippet: '=btnDeleteSnippet'
      },
      link: function (scope, el) {
        el.on('click', function () {
          Modal.deleteSnippet(scope.snippet)
            .then(function (snippet) {
              console.log('deleted', snippet)
            }, function () {
              console.log('delete snippet modal dismissed')
            })
        })
      }
    }
  })
