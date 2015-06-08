/* global angular */
angular.module('codexen')
  .controller('SnippetsDetailController', function (Snippet, $state, $rootScope) {
    var vm = this

    vm.isLoaded = false

    var snippetId = $state.params.id

    Snippet.show(snippetId, {
      'include': ['Tag']
    })
    .success(function (data) {
      vm.snippet = data
      vm.isLoaded = true
    })

    vm.delete = function () {
      Snippet.delete(vm.snippet.id)
      .success(function () {
        $rootScope.$broadcast('snippetDeleted')
      })
    }
  })
