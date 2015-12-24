const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const app = electron.app
const ipcMain = electron.ipcMain
const Tray = electron.Tray
const path = require('path')
const nodeIpc = require('@rokt33r/node-ipc')

var appQuit = false
var isFinderLoaded = false

nodeIpc.config.id = 'finder'
nodeIpc.config.retry = 1500
nodeIpc.config.silent = true

nodeIpc.connectTo(
  'main',
  path.join(app.getPath('userData'), 'boost.service'),
  function () {
    nodeIpc.of.main.on(
      'error',
      function (err) {
        nodeIpc.log('<< ## err ##'.rainbow, nodeIpc.config.delay)
        nodeIpc.log(err)
      }
    )
    nodeIpc.of.main.on(
      'connect',
      function () {
        nodeIpc.log('<< ## connected to world ##'.rainbow, nodeIpc.config.delay)
      }
    )
    nodeIpc.of.main.on(
      'disconnect',
      function () {
        nodeIpc.log('<< disconnected from main'.notice)
        if (process.platform === 'darwin') {
          appQuit = true
          app.quit()
        }
      }
    )
    nodeIpc.of.main.on(
      'message',
      function (payload) {
        switch (payload.type) {
          case 'open-finder':
            if (isFinderLoaded) openFinder()
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

var config = {
  width: 640,
  height: 400,
  show: false,
  frame: false,
  resizable: false,
  'zoom-factor': 1.0,
  'web-preferences': {
    'overlay-scrollbars': true,
    'skip-taskbar': true
  },
  'standard-window': false
}

if (process.platform === 'darwin') {
  config['always-on-top'] = true
}

var finderWindow = new BrowserWindow(config)

var url = path.resolve(__dirname, '../browser/finder/index.html')

finderWindow.loadURL('file://' + url)
finderWindow.setSkipTaskbar(true)

if (process.platform === 'darwin') {
  finderWindow.setVisibleOnAllWorkspaces(true)
}

finderWindow.on('blur', function () {
  hideFinder()
})

finderWindow.on('close', function (e) {
  if (process.platform === 'darwin') {
    if (appQuit) return true
    e.preventDefault()
    finderWindow.hide()
  }
})

var appIcon = new Tray(path.join(__dirname, '../resources/tray-icon.png'))
appIcon.setToolTip('Boost')

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
    openFinder()
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

finderWindow.webContents.on('did-finish-load', function () {
  isFinderLoaded = true
})

function openFinder () {
  if (isFinderLoaded) finderWindow.show()
}
function hideFinder () {
  if (process.platform === 'win32') {
    finderWindow.minimize()
    return
  }
  if (process.platform === 'darwin') {
    Menu.sendActionToFirstResponder('hide:')
  }
  finderWindow.hide()
}
module.exports = finderWindow
