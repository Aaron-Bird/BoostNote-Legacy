/* global angular */
angular.module('codexen')
  .controller('DeleteSnippetModalController', function ($modalInstance, Snippet, snippet) {
    var vm = this

    vm.submit = function () {
      Snippet.delete(snippet.id)
        .success(function (snippet) {
          $modalInstance.close(snippet)
        })
    }

    vm.cancel = function () {
      $modalInstance.dismiss()
    }
  })
