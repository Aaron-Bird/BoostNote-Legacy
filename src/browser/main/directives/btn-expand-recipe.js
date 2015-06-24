/* global angular */
angular.module('codexen')
  .directive('btnExpandRecipe', function (Modal) {
    return {
      restrict: 'A',
      scope: {
        recipe: '=btnExpandRecipe'
      },
      link: function (scope, el) {
        el.on('click', function () {
          Modal.expandRecipe(scope.recipe)
        })
      }
    }
  })
