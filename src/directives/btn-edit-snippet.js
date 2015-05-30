angular.module('codexen.directives')
  .directive('btnEditSnippet', function (editSnippetModal, $rootScope) {
    return {
      scope:{
        snippet: '=btnEditSnippet'
      },
      link: function (scope, el) {
        el.on('click', function () {
          editSnippetModal.open(scope.snippet)
            .result.then(function (snippet) {
              $rootScope.$broadcast('snippetUpdated', snippet)
            }, function () {
              console.log('edit snippet modal dismissed')
            })
        })
      }
    }
  })
