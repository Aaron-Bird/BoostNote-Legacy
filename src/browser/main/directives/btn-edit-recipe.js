/* global angular */
angular.module('codexen')
  .directive('btnEditRecipe', function (Modal) {
    return {
      scope: {
        recipe: '=btnEditRecipe'
      },
      link: function (scope, el) {
        el.on('click', function () {
          Modal.editRecipe(angular.copy(scope.recipe))
        })
      }
    }
  })
