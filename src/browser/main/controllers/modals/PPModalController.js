/* global angular */
angular.module('codexen')
  .controller('PPModalController', function ($modalInstance) {
    var vm = this

    vm.isAgreement = false

    vm.cancel = function () {
      $modalInstance.dismiss('cancel')
    }
  })
