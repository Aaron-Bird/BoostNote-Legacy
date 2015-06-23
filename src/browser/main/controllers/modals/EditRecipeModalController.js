/* global angular */
angular.module('codexen')
  .controller('EditRecipeModalController', function (Recipe, Tag, $modalInstance, recipe) {
    var vm = this

    vm.recipe = recipe

    vm.submit = function () {
      var params = {
        title: vm.recipe.title,
        content: vm.recipe.content,
        Tags: angular.isArray(vm.recipe.Tags) ? vm.recipe.Tags.map(function (tag) { return tag.name }) : []
      }

      Recipe.update(vm.recipe.id, params)
        .success(function (data) {
          $modalInstance.close(data)
        })
    }

    // vm.tags = []
    vm.tagCandidates = []
    vm.refreshTagCandidates = function (tagName) {
      if (tagName == null || tagName === '') return null
      return Tag.findByName(tagName)
        .success(function (data) {
          console.log('tags fetched!!', data)
          vm.tagCandidates = data
        })
    }
    vm.transform = function (tagName) {
      return {
        id: 0,
        name: tagName
      }
    }

    vm.cancel = function () {
      $modalInstance.dismiss()
    }

  })
