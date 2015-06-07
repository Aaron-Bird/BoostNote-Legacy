/* global angular */
angular.module('codexen')
  .controller('SnippetsDetailController', function (Snippet, $state, $rootScope) {
    var vm = this

    vm.isLoaded = false

    var snippetId = $state.params.id

    Snippet.show(snippetId)
    .success(function (data) {
      vm.snippet = data.snippet
      vm.isLoaded = true
    })

    vm.delete = function () {
      Snippet.delete(vm.snippet._id)
      .success(function () {
        $rootScope.$broadcast('snippetDeleted')
      })
    }
  })
