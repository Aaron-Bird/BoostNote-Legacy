// document.getElementById('search-input').focus()

var remote = require('remote')
var ipc = require('ipc')

var SEARCH_INPUT = 1
var RESULT_LIST = 2
var RESULT_DETAIL = 3

angular.module('codexen.popup', [
  'ui.ace',
  'satellizer',
  'cfp.hotkeys'
])
.controller('PopUpController', function ($scope, Snippet, $auth, $window, hotkeys, $document, $filter) {

  // For Dev
  $scope.toggleDev = function () {
    remote.getCurrentWindow().toggleDevTools()
  }

  // Setup Events
  remote.getCurrentWindow().on('focus', function () {
    $scope.$apply(focusSearchInput)
  })

  hotkeys.bindTo($scope)
    .add('down', function (e) {
      if ($scope.isFocusing === RESULT_LIST) selectNextItem()
      e.preventDefault()
    })
    .add('up', function (e) {
      if ($scope.isFocusing === RESULT_LIST) selectPriorItem()
      e.preventDefault()
    })
    .add('right', function (e) {
      if ($scope.isFocusing === RESULT_LIST) focusDetail()
    })
    .add('left', function (e) {
      if ($scope.isFocusing === RESULT_DETAIL) focusList()
    })
    .add('esc', function (e) {
      switch ($scope.isFocusing) {
        case RESULT_LIST:
          focusSearchInput()
          break
        case RESULT_DETAIL:
          focusList()
          break
        case SEARCH_INPUT:
          hidePopUp()
      }
    })
    .add('tab', function (e) {
      if ($scope.isFocusing === RESULT_LIST) focusDetail()

    })

  // Init Data
  $scope.snippets = []

  var userId = $auth.getPayload().sub
  Snippet.findByUser(userId)
    .success(function (data) {
      $scope.snippets = data.snippets
      $scope.selectedItem = $scope.snippets[0]
      filterList()
    })
  function filterList (needle) {
    $scope.filteredSnippets = $filter('filter')($scope.snippets, needle)
  }
  $scope.filterList = filterList

  $scope.isFocusing = 0
  $scope.selectIndex = 0

  $scope.selectItem = selectItem
  function selectItem (index) {
    $scope.selectIndex = index
    $scope.selectedItem = $scope.filteredSnippets[index]
  }

  function selectNextItem () {
    if ($scope.selectIndex >= ($scope.filteredSnippets.length -1)) {
      return
    }
    selectItem(++$scope.selectIndex)
  }

  function selectPriorItem () {
    if ($scope.selectIndex == 0) {
      focusSearchInput()
      return
    }
    selectItem(--$scope.selectIndex)
  }

  function focusSearchInput () {
    $scope.isFocusing = SEARCH_INPUT
    document.getElementById('search-input').focus()
  }

  function focusList () {
    $scope.isFocusing = RESULT_LIST
    document.getElementById('search-input').blur()
  }
  $scope.focusList = focusList

  function focusDetail () {
    $scope.isFocusing = RESULT_DETAIL
  }

  function hidePopUp () {
    remote.getCurrentWindow().hide()
  }
})
.directive('resultItem', function () {
  return {
    link: function (scope, el, attr) {

    }
  }
})
.directive('searchInput', function () {
  return {
    restrict: 'A',
    link: function (scope, el, attr) {
      el.on('keydown', function (e) {

        // Down key => Focus on Result list
        if (e.keyCode === 40) {
          scope.focusList()
          e.preventDefault()
        }

        // Esc key => Dismiss popup
        if (e.keyCode === 27) {
          ipc.send('hidePopUp')
          e.preventDefault()
        }

        // TODO: Tab key => Auto complete
        if (e.keyCode === 9) {
          e.preventDefault()
        }
      })
    }
  }
})
