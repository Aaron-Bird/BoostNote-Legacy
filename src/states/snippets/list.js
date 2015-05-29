/* global angular */
angular.module('codexen.states')
  .controller('SnippetsListController', function ($auth, Snippet, $scope) {
    var vm = this

    vm.isLoaded = false

    var laodSnippets = function () {
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

    laodSnippets()

    $scope.$on('userSignIn', function () {
      laodSnippets()
    })

    $scope.$on('userSignOut', function () {
      laodSnippets()
    })

    $scope.$on('snippetUpdated', function () {
      laodSnippets()
    })

    $scope.$on('snippetDeleted', function () {
      laodSnippets()
    })

  })
