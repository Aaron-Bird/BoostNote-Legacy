/* global angular */
angular.module('codexen')
  .controller('NewSnippetModalController', function ($modalInstance, aceModes, $log, Snippet, $rootScope, Tag){
    var vm = this

    vm.aceModes = aceModes

    vm.submit = function () {
      var params = {
        description: vm.description,
        callSign: vm.callSign,
        mode: vm.mode == null ? null : vm.mode.toLowerCase(),
        content: vm.content,
        tags: angular.isArray(vm.Tags) ? vm.Tags.map(function (tag) { return tag.name }) : []
      }

      Snippet.create(params)
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
