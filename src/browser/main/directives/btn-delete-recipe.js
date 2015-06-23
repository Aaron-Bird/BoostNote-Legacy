/* global angular */
angular.module('codexen')
  .directive('btnDeleteRecipe', function (Modal, $rootScope) {
    return {
      scope: {
        recipe: '=btnDeleteRecipe'
      },
      link: function (scope, el) {
        el.on('click', function () {
          Modal.deleteRecipe(scope.recipe)
            .then(function (recipe) {
              console.log('deleted', recipe)
            }, function () {
              console.log('delete snippet modal dismissed')
            })
        })
      }
    }
  })
