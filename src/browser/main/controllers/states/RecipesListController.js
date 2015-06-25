/* global angular */
angular.module('codexen')
  .controller('RecipesListController', function (Recipe, $state, $scope, $filter, myRecipes, User, $auth) {
    var vm = this


    vm.recipes = myRecipes

    vm.searchRecipes = searchRecipes
    vm.searchRecipes()

    vm.isAuthenticated = $auth.isAuthenticated()
    var reloadUser = function () {
      if (vm.isAuthenticated) {
        User.me().success(function (data) {
          vm.currentUser = data
        })
      }
    }
    reloadUser()

    $scope.$on('$stateChangeSuccess', function (e, toState, toParams) {
      if (!toState.name.match(/recipes/)) return null

      vm.recipeId = parseInt(toParams.id, 10)

      if (!vm.recipeId && vm.filtered && vm.filtered[0]) {
        $state.go('recipes.detail', {id: vm.filtered[0].id})
      }
    })

    $scope.$on('recipeUpdated', function (e, recipe) {
      if (!myRecipes.some(function (_recipe, index) {
        if (_recipe.id === recipe.id) {
          myRecipes[index] = recipe
          return true
        }
        return false
      })) myRecipes.unshift(recipe)

      searchRecipes()
      vm.recipeId = recipe.id
      $state.go('recipes.detail', {id: recipe.id})
    })

    $scope.$on('recipeDeleted', function () {
      if ($state.is('recipes.detail')) {
        var currentRecipeId = parseInt($state.params.id, 10)
        // Delete recipe from recipe list
        for (var i = 0; i < vm.recipes.length; i++) {
          if (vm.recipes[i].id === currentRecipeId) {
            vm.recipes.splice(i, 1)
            break
          }
        }
        // Delete recipe from `filtered list`
        // And redirect `next filtered recipe`
        for (i = 0; i < vm.filtered.length; i++) {
          if (vm.filtered[i].id === currentRecipeId) {
            if (vm.filtered[i + 1] != null) $state.go('recipes.detail', {id: vm.filtered[i + 1].id})
            else if (vm.filtered[i - 1] != null) $state.go('recipes.detail', {id: vm.filtered[i - 1].id})
            else $state.go('recipes')

            vm.filtered.splice(i, 1)
            break
          }
        }

      }
    })

    $scope.$on('tagSelected', function (e, tag) {
      e.stopPropagation()
      $scope.$apply(function () {
        vm.search = '#' + tag.name
        searchRecipes()
      })
    })

    function loadRecipes () {
      if ($auth.isAuthenticated) {
        Recipe.findMine()
          .success(function (data) {
            vm.recipes = data
          })
      } else {
        vm.recipes = void 0
      }
    }

    function searchRecipes () {
      vm.filtered = $filter('searchSnippets')(myRecipes, vm.search)
      if (vm.search && vm.filtered && vm.filtered[0] && (!vm.recipeId || vm.recipeId !== vm.filtered[0].id)) {
        $state.go('recipes.detail', {id: vm.filtered[0].id})
      }
    }

  })
