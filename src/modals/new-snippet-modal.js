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
  .controller('NewSnippetModalController', function ($modalInstance, aceModes, $log, Snippet, $rootScope){
    var vm = this

    vm.aceModes = aceModes

    vm.submit = function () {
      var params = {
        title: vm.title,
        description: vm.description,
        prefix: vm.prefix,
        mode: vm.mode==null?null:vm.mode.name.toLowerCase(),
        content: vm.content
      }

      Snippet.create(params)
        .success(function(data){
          $modalInstance.close(data.snippet)
          console.log('snippet created!', data)
        })
    }

    vm.cancel = function () {
      $modalInstance.dismiss()
    }
  })
