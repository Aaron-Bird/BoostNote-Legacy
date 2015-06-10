/* global angular */
angular.module('codexen')
  .directive('tagList', function () {
    return {
      restrict: 'A',
      template: '<p class="tags" ng-if="tags.length">' +
        '<i class="fa fa-tags"></i> ' +
        '<a tag-item="tag" ng-repeat="tag in tags" href></a>' +
        '</p>',
      scope: {
        tags: '=tagList'
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
