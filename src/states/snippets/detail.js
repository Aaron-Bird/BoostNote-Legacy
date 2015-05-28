/* global angular */
angular.module('codexen.states')
  .controller('SnippetsDetailController', function (Snippet, $state) {
    var vm = this

    vm.isLoaded = false

    var snippetId = $state.params.id

    Snippet.show(snippetId)
      .success(function (data) {
        vm.snippet = data.snippet
        vm.isLoaded = true
      })
  })
