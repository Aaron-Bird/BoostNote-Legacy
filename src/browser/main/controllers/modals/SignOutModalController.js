/* global angular */
angular.module('codexen')
  .controller('SignOutModalController', function ($modalInstance) {
    var vm = this

    vm.submit = function () {
      $modalInstance.close()
    }

    vm.cancel = function () {
      $modalInstance.dismiss('cancel')
    }
  })
