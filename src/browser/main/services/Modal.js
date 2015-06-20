/* global angular */
angular.module('codexen')
  .factory('Modal', function ($modal) {
    var newSnippet = function () {
      return $modal.open({
        templateUrl: 'tpls/modals/new-snippet-modal.tpl.html',
        controller: 'NewSnippetModalController as vm'
      })
    }

    var editSnippet = function (snippet) {
      return $modal.open({
        resolve: {
          snippet: function () {
            return snippet
          }
        },
        templateUrl: 'tpls/modals/edit-snippet-modal.tpl.html',
        controller: 'EditSnippetModalController as vm'
      })
    }

    var deleteSnippet = function (snippet) {
      return $modal.open({
        resolve: {
          snippet: function () {
            return snippet
          }
        },
        templateUrl: 'tpls/modals/delete-snippet-modal.tpl.html',
        controller: 'DeleteSnippetModalController as vm'
      })
    }

    return {
      newSnippet: newSnippet,
      editSnippet: editSnippet,
      deleteSnippet: deleteSnippet
    }
  })
