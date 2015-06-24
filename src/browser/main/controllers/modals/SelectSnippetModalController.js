/* global angular */
angular.module('codexen')
  .controller('SelectSnippetModalController', function (Snippet, $modalInstance) {
    var vm = this

    vm.select = function (snippet) {
      $modalInstance.close(snippet)
    }

    vm.cancel = function () {
      $modalInstance.dismiss('cancel')
    }

    Snippet.findMine()
      .success(function (snippets) {
        vm.snippets = snippets
      })
  })
