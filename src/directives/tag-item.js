/* global angular */
angular.module('codexen')
  .directive('tagItem', function () {
    return {
      restrict: 'A',
      template: '#<span ng-bind="tag.name"></span>',
      scope: {
        tag: '=tagItem'
      },
      link: function (scope, el) {
        el.on('click', function () {
          scope.$emit('tagSelected', scope.tag)
        })
      }
    }
  })
