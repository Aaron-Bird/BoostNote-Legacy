/* global angular */
angular.module('codexen')
  .directive('btnNewRecipe', function (Modal) {
    return {
      restrict: 'A',
      link: function (scope, el) {
        el.on('click', function () {
          Modal.newRecipe()
        })
      }
    }
  })
