/* global angular */
angular.module('codexen')
  .controller('DeleteRecipeModalController', function ($modalInstance, Recipe, recipe) {
    var vm = this

    vm.submit = function () {
      Recipe.delete(recipe.id)
        .success(function (recipe) {
          $modalInstance.close(recipe)
        })
    }

    vm.cancel = function () {
      $modalInstance.dismiss()
    }
  })
