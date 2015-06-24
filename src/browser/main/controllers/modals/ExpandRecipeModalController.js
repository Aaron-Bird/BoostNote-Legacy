/* global angular */
angular.module('codexen')
  .controller('ExpandRecipeModalController', function (recipe, $modalInstance, $scope, Modal) {
    var vm = this
    console.log(recipe)

    vm.recipe = recipe

    vm.cancel = function () {
      $modalInstance.dismiss('cancel')
    }

    vm.insert = function (type) {
      $scope.$broadcast('insertRequested', type)
    }

    vm.insertSnippet = function () {
      Modal.selectSnippet()
        .then(function (snippet) {
          $scope.$broadcast('insertSnippetRequested', snippet)
        })
    }
  })
