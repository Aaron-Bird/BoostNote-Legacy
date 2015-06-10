/* global angular */
angular.module('codexen')
  .directive('tagList', function () {
    return {
      restrict: 'A',
      template: '<p class="tags">' +
        '<i class="fa fa-tags"></i> ' +
        '<a tag-item="tag" ng-repeat="tag in tags" href></a>' +
        '<a ng-if="!tags.length" ng-click="requestTagging($event)" href> Not tagged yet</a>' +
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

        scope.requestTagging = function (e) {
          e.preventDefault()
          e.stopPropagation()
          scope.$emit('taggingRequested')
        }
      }
    }
  })
