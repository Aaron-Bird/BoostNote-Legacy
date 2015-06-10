/* global angular */
angular.module('codexen')
  .directive('snippetItem', function (Modal, $rootScope) {
    return {
      restrict: 'A',
      transclude: true,
      template: '<div ng-transclude></div>',
      scope: {
        snippet: '=snippetItem'
      },
      link: function (scope, elem) {
        scope.$on('taggingRequested', function (e) {
          e.stopPropagation()
          e.preventDefault()
          Modal.editSnippet(angular.copy(scope.snippet))
            .result.then(function (snippet) {
            $rootScope.$broadcast('snippetUpdated', snippet)
          }, function () {
            console.log('edit snippet modal dismissed')
          })
        })
      }
    }
  })
