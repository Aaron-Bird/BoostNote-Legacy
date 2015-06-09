/* global angular */
angular.module('codexen')
  .filter('searchSnippets', function ($filter) {
    return function (input, needle) {
      if (!angular.isString(needle)) return input
      if (needle.match(/^#./)) {
        var name = needle.match(/^#(.+)/)[1]
        return input.filter(function (snippet) {
          return snippet.Tags.some(function (tag) {
            return tag.name.match(new RegExp(name))
          })
        })
      }
      else return $filter('filter')(input, needle)
    }
  })
