/* global angular */
angular.module('codexen')
  .factory('Modal', function ($modal, $rootScope) {
    /* Recipe */
    var newRecipe = function () {
      return $modal.open({
        templateUrl: 'tpls/modals/new-recipe-modal.html',
        controller: 'NewRecipeModalController as vm'
      }).result.then(function (recipe) {
        $rootScope.$broadcast('recipeUpdated', recipe)
      })
    }

    var editRecipe = function (recipe) {
      return $modal.open({
        resolve: {
          recipe: function () {
            return recipe
          }
        },
        templateUrl: 'tpls/modals/edit-recipe-modal.html',
        controller: 'EditRecipeModalController as vm'
      }).result.then(function (recipe) {
        $rootScope.$broadcast('recipeUpdated', recipe)
      })
    }

    var expandRecipe = function (recipe) {
      return $modal.open({
        size: 'lg',
        resolve: {
          recipe: function () {
            return recipe
          }
        },
        templateUrl: 'tpls/modals/expand-recipe-modal.html',
        controller: 'ExpandRecipeModalController as vm'
      })
    }

    var deleteRecipe = function (recipe) {
      return $modal.open({
        resolve: {
          recipe: function () {
            return recipe
          }
        },
        templateUrl: 'tpls/modals/delete-recipe-modal.html',
        controller: 'DeleteRecipeModalController as vm'
      }).result.then(function (recipe) {
        $rootScope.$broadcast('recipeDeleted', recipe)
      })
    }

    /* Snippet */
    var newSnippet = function () {
      return $modal.open({
        templateUrl: 'tpls/modals/new-snippet-modal.tpl.html',
        controller: 'NewSnippetModalController as vm'
      }).result.then(function (snippet) {
        $rootScope.$broadcast('snippetUpdated', snippet)
      })
    }

    var editSnippet = function (snippet) {
      return $modal.open({
        resolve: {
          snippet: function () {
            return snippet
          }
        },
        templateUrl: 'tpls/modals/edit-snippet-modal.tpl.html',
        controller: 'EditSnippetModalController as vm'
      }).result.then(function (snippet) {
        $rootScope.$broadcast('snippetUpdated', snippet)
      })
    }

    var deleteSnippet = function (snippet) {
      return $modal.open({
        resolve: {
          snippet: function () {
            return snippet
          }
        },
        templateUrl: 'tpls/modals/delete-snippet-modal.tpl.html',
        controller: 'DeleteSnippetModalController as vm'
      }).result.then(function (snippet) {
        $rootScope.$broadcast('snippetDeleted', snippet)
      })
    }

    var selectSnippet = function (snippet) {
      return $modal.open({
        templateUrl: 'tpls/modals/select-snippet-modal.html',
        controller: 'SelectSnippetModalController as vm'
      }).result
    }

    return {
      newRecipe: newRecipe,
      editRecipe: editRecipe,
      deleteRecipe: deleteRecipe,
      expandRecipe: expandRecipe,
      newSnippet: newSnippet,
      editSnippet: editSnippet,
      deleteSnippet: deleteSnippet,
      selectSnippet: selectSnippet
    }
  })
