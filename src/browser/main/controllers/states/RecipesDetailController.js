/* global angular */
angular.module('codexen')
  .controller('RecipesDetailController', function (Recipe, $state, $rootScope, $scope, Modal) {
    var vm = this

    vm.isLoaded = false

    var recipeId = $state.params.id

    Recipe.show(recipeId)
      .success(function (data) {
        vm.recipe = data
        vm.isLoaded = true
      })

    $scope.$on('taggingRequested', function (e) {
      e.stopPropagation()
      e.preventDefault()
      Modal.editRecipe(angular.copy(vm.recipe))
        .then(function (recipe) {
          console.log('edited', recipe)
        }, function () {
          console.log('edit recipe modal dismissed')
        })
    })

    $scope.$on('recipeUpdated', function (e, recipe) {
      console.log('event received', recipe)
      if (recipe.id === vm.recipe.id) vm.recipe = recipe
    })

  })
