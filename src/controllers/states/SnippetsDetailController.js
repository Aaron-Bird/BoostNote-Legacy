/* global angular */
angular.module('codexen')
  .controller('SnippetsDetailController', function (Snippet, $state, $rootScope, $scope) {
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

    // TODO: When deletion occurs, switch the next snippet
    // TODO: Add deletion confirmation modal
    vm.delete = function () {
      Snippet.delete(vm.snippet.id)
        .success(function () {
          $rootScope.$broadcast('snippetDeleted')
        })
    }

    $scope.$on('snippetUpdated', function (e, snippet) {
      console.log('event received', snippet)
      if (snippet.id === vm.snippet.id) vm.snippet = snippet
    })
  })
