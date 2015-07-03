/* global angular */
angular.module('codexen')
  .controller('AgreementModalController', function ($modalInstance, Modal) {
    var vm = this

    vm.isAgreement = true

    vm.showPP = Modal.showPP

    vm.submit = function () {
      $modalInstance.close()
    }

    vm.cancel = function () {
      $modalInstance.dismiss('cancel')
    }
  })
