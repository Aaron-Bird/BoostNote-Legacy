/* global angular */
angular.module('codexen')
  .directive('recipeItem', function (Modal, $rootScope) {
    return {
      restrict: 'A',
      transclude: true,
      template: '<div ng-transclude></div>',
      scope: {
        recipe: '=recipeItem'
      },
      link: function (scope, elem) {
        scope.$on('taggingRequested', function (e) {
          e.stopPropagation()
          e.preventDefault()
          Modal.editRecipe(angular.copy(scope.recipe))
        })
      }
    }
  })
