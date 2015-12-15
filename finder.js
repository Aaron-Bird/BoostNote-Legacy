const electron = require('electron')
const app = electron.app
const Tray = electron.Tray
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const ipcMain = electron.ipcMain
const path = require('path')

const nodeIpc = require('node-ipc')

var finderWindow = null
var isFinderLoaded = false

function hideFinder () {
  if (!isFinderLoaded) return false

  if (process.platform === 'darwin') {
    Menu.sendActionToFirstResponder('hide:')
  }
  if (process.platform === 'win32') {
    finderWindow.minimize()
  }
  finderWindow.hide()
}

function showFinder () {
  if (!isFinderLoaded) return false

  if (!finderWindow.isVisible()) {
    finderWindow.show()
  }
  if (process.platform === 'win32') {
    finderWindow.minimize()
    finderWindow.restore()
  }
}

nodeIpc.config.id = 'finder'
nodeIpc.config.retry = 1500
nodeIpc.config.silent = true

nodeIpc.connectTo(
  'main',
  path.join(app.getPath('userData'), 'boost.service'),
  function () {
      nodeIpc.of.main.on(
        'connect',
        function () {
          nodeIpc.log('<< ## connected to world ##'.rainbow, nodeIpc.config.delay)
        }
      )
      nodeIpc.of.main.on(
        'disconnect',
        function(){
          nodeIpc.log('<< disconnected from main'.notice)
        }
      )
      nodeIpc.of.main.on(
        'message',
        function (payload) {
          switch (payload.type) {
            case 'open-finder':
              showFinder()
              break
          }
        }
      )
  }
)

function emit (type, data) {
  var payload = {
    type: type,
    data: data
  }
  nodeIpc.of.main.emit('message', payload)
}

var appQuit = false
app.on('ready', function () {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }

  var appIcon = new Tray(__dirname + '/resources/tray-icon.png')
  appIcon.setToolTip('Boost')

  var template = require('./atom-lib/menu-template')
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  finderWindow = require('./atom-lib/finder-window')
  finderWindow.webContents.on('did-finish-load', function () {
    var trayMenu = new Menu()
    trayMenu.append(new MenuItem({
      label: 'Open Main window',
      click: function () {
        emit('show-main-window')
      }
    }))
    trayMenu.append(new MenuItem({
      label: 'Open Finder window',
      click: function () {
        showFinder()
      }
    }))
    trayMenu.append(new MenuItem({
      label: 'Quit',
      click: function () {
        emit('quit-app')
      }
    }))
    appIcon.setContextMenu(trayMenu)
    appIcon.on('click', function (e) {
      e.preventDefault()
      appIcon.popUpContextMenu(trayMenu)
    })

    ipcMain.on('copy-finder', function () {
      emit('copy-finder')
    })

    ipcMain.on('hide-finder', function () {
      hideFinder()
    })

    isFinderLoaded = true
  })

  finderWindow.on('blur', function () {
    hideFinder()
  })

  finderWindow.on('close', function (e) {
    if (appQuit) return true
    e.preventDefault()
    hideFinder()
  })
})

