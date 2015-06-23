/* global angular  marked*/
angular.module('codexen')
  .filter('marked', function () {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false
    })

    return function(input) {
      return marked(input)
    }
  })
