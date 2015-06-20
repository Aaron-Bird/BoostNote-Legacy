/* global angular */
angular.module('codexen')
  .directive('sideNav', function () {
    return {
      templateUrl: 'tpls/directives/side-nav.tpl.html',
      controller: 'SideNavController as vm'
    }
  })
