/* global angular moment */
angular.module('codexen')
.filter('fromNow', function () {
  return function (input) {
    return moment(input).fromNow()
  }
})
