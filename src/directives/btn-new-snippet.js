angular.module('codexen.directives')
  .directive('btnNewSnippet', function (newSnippetModal, $rootScope) {
    return {
      link: function (scope, el) {
        el.on('click', function () {
          newSnippetModal.open()
            .result.then(function (snippet) {
              $rootScope.$broadcast('snippetUpdated', snippet)
            }, function () {
              console.log('new snippet modal dismissed')
            })
        })
      }
    }
  })
