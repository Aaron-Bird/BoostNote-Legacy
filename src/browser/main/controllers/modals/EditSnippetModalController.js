/* global angular */
angular.module('codexen')
  .controller('EditSnippetModalController', function ($modalInstance, aceModes, $log, Snippet, $rootScope, Tag, snippet) {
    var vm = this

    vm.aceModes = aceModes
    vm.snippet = snippet

    vm.submit = function () {
      var params = {
        description: vm.snippet.description,
        callSign: vm.snippet.callSign,
        mode: vm.snippet.mode == null ? null : vm.snippet.mode.toLowerCase(),
        content: vm.snippet.content,
        Tags: angular.isArray(vm.snippet.Tags) ? vm.snippet.Tags.map(function (tag) { return tag.name }) : []
      }
      Snippet.update(vm.snippet.id, params)
        .success(function (data) {
          console.log('updated res :', data)
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
