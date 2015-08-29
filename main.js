var app = require('app')
var BrowserWindow = require('browser-window')
var Menu = require('menu')
var MenuItem = require('menu-item')
var Tray = require('tray')
var ipc = require('ipc')

require('crash-reporter').start()

var mainWindow = null
var appIcon = null
var menu = null
var popUpWindow = null

var update = null

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })

var version = app.getVersion()
global.version = version
var versionText = (version == null || version.length === 0) ? 'DEV version' : 'v' + version
var nn = require('node-notifier')
var autoUpdater = require('auto-updater')
var path = require('path')

autoUpdater
  .on('error', function (err, message) {
    console.error(message)
    nn.notify({
      title: 'Error! ' + versionText,
      icon: path.join(__dirname, 'browser/main/resources/favicon-230x230.png'),
      message: message
    })
  })
  .on('checking-for-update', function () {
    // Connecting
  })
  .on('update-available', function () {
    nn.notify({
      title: 'Update is available!! ' + versionText,
      icon: path.join(__dirname, 'browser/main/resources/favicon-230x230.png'),
      message: 'Download started.. wait for the update ready.'
    })
  })
  .on('update-not-available', function () {
    nn.notify({
      title: 'Latest Build!! ' + versionText,
      icon: path.join(__dirname, 'browser/main/resources/favicon-230x230.png'),
      message: 'Hope you to enjoy our app :D'
    })
  })
  .on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    nn.notify({
      title: 'Ready to Update!! ' + versionText,
      icon: path.join(__dirname, 'browser/main/resources/favicon-230x230.png'),
      message: 'Click tray icon to update app: ' + releaseName
    })
    update = quitAndUpdate

    if (mainWindow != null && !mainWindow.webContents.isLoading()) {
      mainWindow.webContents.send('update-available', 'Update available!')
    }
  })

app.on('ready', function () {
  console.log('Version ' + version)
  autoUpdater.setFeedUrl('http://orbital.b00st.io/rokt33r/boost/latest?version=' + version)
  autoUpdater.checkForUpdates()
  // menu start
  var template = require('./modules/menu-template')

  ipc.on('update-app', function (event, msg) {
    if (update != null) {
      update()
    }
  })

  menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
  // menu end
  appIcon = new Tray(__dirname + '/tray-icon.png')
  appIcon.setToolTip('Boost')

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
    },
    'standard-window': false
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
    },
    'standard-window': false
  })
  if (update != null) {
    mainWindow.webContents.on('did-finish-load', function () {
      mainWindow.webContents.send('update-available', 'whoooooooh!')
    })
  }

  mainWindow.loadUrl('file://' + __dirname + '/browser/main/index.electron.html')

  mainWindow.webContents.on('new-window', function (e) {
    e.preventDefault()
  })

  mainWindow.on('closed', function () {
    console.log('main closed')
    mainWindow = null
    app.dock.hide()
  })
  app.dock.show()
}
