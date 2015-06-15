/* global angular */
angular.module('codexen')
  .controller('SnippetsListController', function ($auth, Snippet, $scope, $state, $scope, $filter, mySnippets) {
    var vm = this

    vm.isLoading = false

    vm.snippetId = parseInt($state.params.id)

    vm.snippets = mySnippets

    vm.searchSnippets = searchSnippets
    vm.searchSnippets()

    // TODO: add Navigation methods
    // vm.nextSnippet()
    // vm.priorSnippet()
    // vm.firstSnippet()
    // vm.lastSnippet()

    // TODO: keyboard navigating UX

    $scope.$on('$stateChangeSuccess', function (e, toState, toParams) {
      if (!toState.name.match(/snippets/)) return null

      vm.snippetId = parseInt(toParams.id)

      if (!vm.snippetId && vm.filtered[0]) {
        $state.go('snippets.detail', {id: vm.filtered[0].id})
      }
    })


    $scope.$on('snippetUpdated', function (e, snippet) {
      if (!mySnippets.some(function (_snippet, index) {
        if (_snippet.id === snippet.id) {
          mySnippets[index] = snippet
          return true
        }
        return false
      })) mySnippets.unshift(snippet)

      searchSnippets()
      vm.snippetId = snippet.id
      $state.go('snippets.detail', {id: snippet.id})
    })

    $scope.$on('snippetDeleted', function () {
      if ($state.is('snippets.detail')) {
        var currentSnippetId = parseInt($state.params.id)
        // Delete snippet from snippet list
        for (var i = 0; i < vm.snippets.length; i++) {
          if (vm.snippets[i].id === currentSnippetId) {
            vm.snippets.splice(i, 1)
            break
          }
        }
        // Delete snippet from `filtered list`
        // And redirect `next filtered snippet`
        for (var i = 0; i < vm.filtered.length; i++) {
          if (vm.filtered[i].id === currentSnippetId) {
            if (vm.filtered[i+1] != null) $state.go('snippets.detail', {id: vm.filtered[i+1].id})
            else if (vm.filtered[i-1] != null) $state.go('snippets.detail', {id: vm.filtered[i-1].id})
            else $state.go('snippets')

            vm.filtered.splice(i, 1)
            break
          }
        }

      }
    })

    $scope.$on('tagSelected', function (e, tag) {
      e.stopPropagation()
      $scope.$apply(function () {
        vm.search = '#' + tag.name
        searchSnippets()
      })
    })

    function loadSnippets() {
      if ($auth.isAuthenticated) {
        Snippet.findMine()
          .success(function (data) {
            vm.snippets = data
          })
      } else {
        vm.snippets = void 0
      }
    }

    function searchSnippets() {
      vm.filtered = $filter('searchSnippets')(mySnippets, vm.search)
      if (vm.search && vm.filtered[0] && (!vm.snippetId || vm.snippetId !== vm.filtered[0].id)) {
        $state.go('snippets.detail', {id: vm.filtered[0].id})
      }
    }

  })
