/* global angular */
angular.module('codexen.states')
  .controller('SnippetsListController', function ($auth, Snippet, $scope, $state) {
    var vm = this

    vm.isLoaded = false

    var loadSnippets = function () {
      if ($auth.isAuthenticated) {
        console.log($auth.getPayload())
        var userId = $auth.getPayload().sub
        Snippet.findByUser(userId)
          .success(function (data) {
            console.log('snippets fetched', data.snippets)
            vm.isLoaded = true
            vm.snippets = data.snippets
            vm.isGuest = false
          })
      }else {
        vm.isLoaded = true
        vm.isGuest = true
        vm.snippets = void 0
      }
    }

    loadSnippets()

    $scope.$on('userSignIn', function () {
      loadSnippets()
    })

    $scope.$on('userSignOut', function () {
      loadSnippets()
    })

    $scope.$on('snippetUpdated', function (e, snippet) {
      $state.go('snippets.detail', {id: snippet._id})
      loadSnippets()
    })

    $scope.$on('snippetDeleted', function () {
      if ($state.is('snippets.detail')) {
        var currentSnippetId = $state.params.id
        for (var i = 0; i < vm.snippets.length; i++) {
          if (vm.snippets[i]._id === currentSnippetId) {
            var targetSnippet = null

            if (i === 0) targetSnippet = vm.snippets[i+1]
            else targetSnippet = vm.snippets[i-1]

            console.log('target', targetSnippet)
            $state.go('snippets.detail', {id: targetSnippet._id})
            break
          }
        }
      }
      loadSnippets()
    })

  })
