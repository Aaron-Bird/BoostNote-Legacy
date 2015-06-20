/* global angular */
angular.module('codexen', [
  'codexen.shared',
  'ngSanitize',
  'ui.select',
  'ui.ace',
  'ui.router',
  'ui.bootstrap',
  'satellizer',
  'angular-md5',
  'templates'])
  .constant('appName', 'main')
angular.module('templates', [])
