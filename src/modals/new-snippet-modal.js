angular.module('codexen.modals')
  .factory('newSnippetModal', function ($modal) {
    var open = function () {
      return $modal.open({
        templateUrl:'modals/new-snippet-modal.tpl.html',
        controller:'NewSnippetModalController as vm'
      })
    }

    return {
      open: open
    }
  })
  .controller('NewSnippetModalController', function ($modalInstance, aceModes, $log, Snippet, $rootScope, Tag){
    var vm = this

    vm.aceModes = aceModes

    vm.submit = function () {
      var params = {
        description: vm.description,
        callSign: vm.callSign,
        mode: vm.mode==null?null:vm.mode.name.toLowerCase(),
        content: vm.content,
        tags: angular.isArray(vm.tags)?vm.tags.map(function (tag) { return {_id: tag._id, name: tag.name} }):[]
      }

      Snippet.create(params)
        .success(function(data){
          $modalInstance.close(data.snippet)
          console.log('snippet created!', data)
        })
    }

    // vm.tags = []
    vm.tagCandidates = []
    vm.refreshTagCandidates = function(tagName) {
      if (tagName == null || tagName == '') return null
      return Tag.findByName(tagName)
        .success(function (data) {
          console.log('tags fetched!!', data)
          vm.tagCandidates = data.tags
        })
    }
    vm.transform = function (tagName) {
      return {
        _id:0,
        name:tagName
      }
    }

    vm.cancel = function () {
      $modalInstance.dismiss()
    }
  })
