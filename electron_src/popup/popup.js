/* global angular */

var remote = require('remote')
var ipc = require('ipc')

var SEARCH_INPUT = 1
var RESULT_LIST = 2
var RESULT_CONTROL = 3
var RESULT_CONTENT = 4
// var btnClipboard = document.getElementById('btnClipboard')
// var btnEdit = document.getElementById('btnEdit')
// var btnShare = document.getElementById('btnShare')
var aceView = document.getElementById('aceView')

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
      switch ($scope.isFocusing) {
        case RESULT_LIST:
          selectNextItem()
          break
        case RESULT_CONTROL:
          focusContent()
          break
      }
      e.preventDefault()
    })
    .add('up', function (e) {
      switch ($scope.isFocusing) {
        case RESULT_LIST:
          selectPriorItem()
          break
        case RESULT_CONTENT:
          focusControl()
          break
      }
      e.preventDefault()
    })
    .add('right', function (e) {
      if ($scope.isFocusing === RESULT_LIST) {
        focusControl()
        return
      }
      if ($scope.isFocusing === RESULT_CONTROL) {
        nextControl()
      }
    })
    .add('left', function (e) {
      if ($scope.isFocusing === RESULT_CONTROL) {
        priorControl()
      }
    })
    .add('esc', function (e) {
      switch ($scope.isFocusing) {
        case RESULT_LIST:
          focusSearchInput()
          break
        case RESULT_CONTROL:
          focusList()
          break
        case RESULT_CONTENT:
          console.log('esc fr content')
          focusControl()
          break
        case SEARCH_INPUT:
          hidePopUp()
      }
    })
    .add('shift+tab', function (e) {
      e.preventDefault()
      if ($scope.isFocusing === RESULT_CONTROL) {
        priorControl()
        return
      }
    })
    .add('tab', function (e) {
      e.preventDefault()
      if ($scope.isFocusing === RESULT_LIST) {
        focusControl()
        return
      }
      if ($scope.isFocusing === RESULT_CONTROL) {
        nextControl()
        return
      }
    })
    .add('enter', function (e) {
      switch ($scope.isFocusing) {
        case RESULT_LIST:
          console.log($scope.selectedItem.content)
          ipc.send('writeCode', $scope.selectedItem.content)
          break
      }
      e.preventDefault()
    })


  $scope.aceLoaded = function (editor) {
    editor.commands.addCommand({
      name: 'escape',
      bindKey: {win: 'esc', mac: 'esc'},
      exec: function (editor) {
        editor.blur()
        focusControl()
        $scope.$apply()
      },
      readOnly: true
    })
  }

  // Init Data
  $scope.snippets = []

  var userId = $auth.getPayload().sub
  Snippet.findByUser(userId)
    .success(function (data) {
      $scope.snippets = data.snippets
      filterList()
    })

  // Functions

  // Search Filter
  function filterList (needle) {
    $scope.filteredSnippets = $filter('filter')($scope.snippets, needle)
    $scope.selectIndex = 0
    selectItem($scope.selectIndex)
  }
  $scope.filterList = filterList

  function hidePopUp () {
    ipc.send('hidePopUp')
  }

  // Result Item control
  $scope.selectIndex = 0

  $scope.selectItem = selectItem
  function selectItem (index) {
    $scope.selectIndex = index
    $scope.selectedItem = $scope.filteredSnippets[index]

    $scope.controlIndex = 0
  }

  function selectNextItem () {
    if ($scope.selectIndex >= ($scope.filteredSnippets.length - 1)) {
      return
    }
    selectItem(++$scope.selectIndex)
  }

  function selectPriorItem () {
    if ($scope.selectIndex === 0) {
      focusSearchInput()
      return
    }
    selectItem(--$scope.selectIndex)
  }

  // Focusing control
  $scope.isFocusing = 0

  function focusSearchInput () {
    $scope.isFocusing = SEARCH_INPUT
    document.getElementById('search-input').focus()

    $scope.controlIndex = 0
  }
  $scope.focusSearchInput = focusSearchInput

  function focusList () {
    $scope.isFocusing = RESULT_LIST
    document.getElementById('search-input').blur()

    $scope.controlIndex = 0
  }
  $scope.focusList = focusList

  function focusControl () {
    if ($scope.controlIndex === 0) {
      $scope.controlIndex = 1
    }
    $scope.isFocusing = RESULT_CONTROL
  }
  $scope.focusControl = focusControl

  function focusContent () {
    angular.element(aceView).scope().focus()
    $scope.isFocusing = RESULT_CONTENT
  }

  $scope.controlIndex = 0

  function nextControl () {
    if ($scope.controlIndex === 3) {
      $scope.controlIndex = 0
      focusContent()
      return
    }
    $scope.controlIndex ++
  }

  function priorControl () {
    if ($scope.controlIndex === 1) {
      focusList()
      return
    }
    $scope.controlIndex --
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
