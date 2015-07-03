/* global angular */
angular.module('codexen')
  .controller('AgreementModalController', function ($modalInstance) {
    var vm = this

    vm.isAgreement = true

    vm.submit = function () {
      $modalInstance.close()
    }

    vm.cancel = function () {
      $modalInstance.dismiss('cancel')
    }
  })
