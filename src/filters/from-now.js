/* global angular */
angular.module('codexen.filters')
.filter('fromNow', function() {
  return function(input) {
    return moment(input).fromNow()
  }
})
