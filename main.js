var app = require('app')
var BrowserWindow = require('browser-window')
var Menu = require('menu')
var MenuItem = require('menu-item')
var Tray = require('tray')

require('crash-reporter').start()

var mainWindow = null
var appIcon = null
var menu = null
var popUpWindow = null

var update = null

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })

var version = '0.2.0'
var nn = require('node-notifier')
var autoUpdater = require('auto-updater')

autoUpdater
  .on('error', function (err, message) {
    nn.notify({
      title: 'Boost Update Center Ver. ' + version,
      message: message
    })
  })
  .on('checking-for-update', function () {
    nn.notify({
      title: 'Boost Update Center Ver. ' + version,
      message: 'Hello from Main processor, Mr. User!'
    })
  })
  .on('update-available', function () {
    nn.notify({
      title: 'Boost Update Center Ver. ' + version,
      message: 'Update is available. Starting download latest build...'
    })
  })
  .on('update-not-available', function () {
    nn.notify({
      title: 'Boost Update Center Ver. ' + version,
      message: 'Latest Build :D'
    })
  })
  .on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    nn.notify({
      title: 'Boost Update Center Ver. ' + version,
      message: 'Ready to Update: ' + releaseName
    })
    update = quitAndUpdate
  })


app.on('ready', function () {
  console.log('Version ' + version)
  autoUpdater.setFeedUrl('http://localhost:8000/testcat/test/latest?version=' + version)
  autoUpdater.checkForUpdates()
  // menu start
  var template = require('./modules/menu-template')

  menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
  // menu end
  appIcon = new Tray(__dirname + '/tray-icon.png')
  appIcon.setToolTip('Codexen')

  var trayMenu = new Menu()
  trayMenu.append(new MenuItem({
    label: 'Open main window',
    click: function () {
      if (mainWindow == null) {
        makeNewMainWindow()
      }
      mainWindow.show()
    }
  }))
  trayMenu.append(new MenuItem({
    label: 'Update App',
    click: function () {
      if (update != null) {
        update()
      }
    }
  }))
  trayMenu.append(new MenuItem({
    label: 'Quit',
    click: function () {
      app.quit()
    }
  }))
  appIcon.setContextMenu(trayMenu)

  makeNewMainWindow()

  app.on('activate-with-no-open-windows', function () {
    if (mainWindow == null) {
      makeNewMainWindow()
      return
    }
    mainWindow.show()
  })

  popUpWindow = new BrowserWindow({
    width: 600,
    height: 400,
    show: false,
    frame: false,
    'zoom-factor': 1.0,
    'always-on-top': true,
    'web-preferences': {
        'overlay-scrollbars': true,
        'skip-taskbar': true
      }
  })

  popUpWindow.loadUrl('file://' + __dirname + '/browser/finder/index.electron.html')

  popUpWindow.on('blur', function () {
    popUpWindow.hide()
  })
  popUpWindow.setVisibleOnAllWorkspaces(true)

  var globalShortcut = require('global-shortcut')

  globalShortcut.register('ctrl+tab+shift', function () {
    if (mainWindow != null && !mainWindow.isFocused()) {
      mainWindow.hide()
    }
    popUpWindow.show()
  })

  global.hideFinder = function () {
    if (mainWindow == null || !mainWindow.isVisible()) {
      Menu.sendActionToFirstResponder('hide:')
    }
    popUpWindow.hide()
  }
})

function makeNewMainWindow () {
  console.log('new Window!')
  mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    'zoom-factor': 1.0,
    'web-preferences': {
        'overlay-scrollbars': true
      }
  })

  mainWindow.loadUrl('file://' + __dirname + '/browser/main/index.electron.html')

  mainWindow.on('closed', function () {
    console.log('main closed')
    mainWindow = null
    app.dock.hide()
  })
  app.dock.show()
}
