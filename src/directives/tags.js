/* global angular */
angular.module('codexen')
  .directive('tags', function () {
    return {
      restrict: 'A',
      template: '<p class="tags" ng-if="tags.length">' +
        '<i class="fa fa-tags"></i> ' +
        '<a ui-sref="snippets({search:\'tag:\'+tag.name})" ng-repeat="tag in tags" href="#">#<span ng-bind="tag.name"></span></a>' +
        '</p>',
      scope: {
        tags: '='
      },
      link: function (scope, el) {
        el.ready(function () {
          el.find('a').on('click', function (e) {
            e.stopPropagation()
          })
        })
      }
    }
  })
