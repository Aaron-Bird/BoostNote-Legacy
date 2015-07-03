/* global angular */
angular.module('codexen')
  .controller('PPModalController', function ($modalInstance, Modal) {
    var vm = this

    vm.isAgreement = false

    vm.showPP = Modal.showPP

    vm.cancel = function () {
      $modalInstance.dismiss('cancel')
    }
  })
