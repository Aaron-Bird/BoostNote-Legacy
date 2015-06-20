/* global angular */
angular.module('codexen')
  .filter('searchSnippets', function ($filter) {
    return function (input, needle) {
      if (!angular.isString(needle) || !angular.isArray(input)) return angular.copy(input)
      if (needle.match(/#(.+)|tag:(.+)/)) {
        var name = needle.match(/#(.+)/) ? needle.match(/#(.+)/)[1] : needle.match(/tag:(.+)/)[1]

        return input.filter(function (snippet) {
          return snippet.Tags.some(function (tag) {
            return tag.name.match(new RegExp('^'+name))
          })
        })
      }
      else return $filter('filter')(input, needle)
    }
  })
