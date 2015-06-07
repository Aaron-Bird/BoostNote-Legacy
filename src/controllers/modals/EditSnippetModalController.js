/* global angular */
angular.module('codexen')
  .controller('EditSnippetModalController', function ($modalInstance, aceModes, $log, Snippet, $rootScope, Tag, snippet) {
    var vm = this

    vm.aceModes = aceModes
    vm.snippet = snippet
    console.log(snippet)

    vm.submit = function () {
      console.log('mode: ', vm.snippet.mode)
      var params = {
        description: vm.snippet.description,
        callSign: vm.snippet.callSign,
        mode: vm.snippet.mode == null ? null : vm.snippet.mode.toLowerCase(),
        content: vm.snippet.content,
        tags: angular.isArray(vm.snippet.tags) ? vm.snippet.tags.map(function (tag) { return {_id: tag._id, name: tag.name} }) : []
      }

      Snippet.update(vm.snippet._id, params)
        .success(function (data) {
          $modalInstance.close(data.snippet)
          console.log('snippet created!', data)
        })
    }

    // vm.tags = []
    vm.tagCandidates = []
    vm.refreshTagCandidates = function (tagName) {
      if (tagName == null || tagName === '') return null
      return Tag.findByName(tagName)
        .success(function (data) {
          console.log('tags fetched!!', data)
          vm.tagCandidates = data.tags
        })
    }
    vm.transform = function (tagName) {
      return {
        _id: 0,
        name: tagName
      }
    }

    vm.cancel = function () {
      $modalInstance.dismiss()
    }
  })
