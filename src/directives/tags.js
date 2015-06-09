/* global angular */
angular.module('codexen')
  .directive('tags', function () {
    return {
      restrict: 'A',
      template: '<p class="tags" ng-if="tags.length">' +
        '<i class="fa fa-tags"></i> ' +
        '<a ng-repeat="tag in tags" href="#">#<span ng-bind="tag.name"></span></a>' +
        '</p>',
      scope: {
        tags: '='
      }
    }
  })
