/* global angular */
angular.module('codexen')
  .controller('SnippetsDetailController', function (Snippet, $state, $rootScope, $scope, Modal) {
    var vm = this

    vm.isLoaded = false

    var snippetId = $state.params.id

    Snippet.show(snippetId)
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


    $scope.$on('taggingRequested', function (e) {
      e.stopPropagation()
      e.preventDefault()
      Modal.editSnippet(angular.copy(vm.snippet))
        .result.then(function (snippet) {
        $rootScope.$broadcast('snippetUpdated', snippet)
      }, function () {
        console.log('edit snippet modal dismissed')
      })
    })

    $scope.$on('snippetUpdated', function (e, snippet) {
      console.log('event received', snippet)
      if (snippet.id === vm.snippet.id) vm.snippet = snippet
    })
  })
