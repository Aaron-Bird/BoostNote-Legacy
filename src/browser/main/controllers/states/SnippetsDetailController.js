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

    $scope.$on('taggingRequested', function (e) {
      e.stopPropagation()
      e.preventDefault()
      Modal.editSnippet(angular.copy(vm.snippet))
        .then(function (snippet) {
          console.log('edited', snippet)
        }, function () {
          console.log('edit snippet modal dismissed')
        })
    })

    $scope.$on('snippetUpdated', function (e, snippet) {
      console.log('event received', snippet)
      if (snippet.id === vm.snippet.id) vm.snippet = snippet
    })
  })
