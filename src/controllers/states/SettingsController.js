/* global angular */
angular.module('codexen')
  .controller('SettingsController', function (Settings) {
    var vm = this

    vm.changePassword = changePassword
    vm.isSuccess = false
    vm.isError = false

    function changePassword () {
      var params = {
        password: vm.password,
        newPassword: vm.newPassword
      }

      Settings.changePassword(params)
        .success(function (data) {
          resetInput()
          vm.isSuccess = true
          vm.isError = false
        })
        .error(function () {
          resetInput()
          vm.isError = true
          vm.isSuccess = false
        })
    }

    function resetInput () {
      vm.password = ''
      vm.newPassword = ''
    }
  })
