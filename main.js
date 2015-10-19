var app = require('app')
var Menu = require('menu')
var MenuItem = require('menu-item')
var Tray = require('tray')
var ipc = require('ipc')
var jetpack = require('fs-jetpack')

require('crash-reporter').start()

var mainWindow = null
var appIcon = null
var menu = null
var finderWindow = null

var update = null

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })

var version = app.getVersion()
var versionText = (version == null || version.length === 0) ? 'DEV version' : 'v' + version
var nn = require('node-notifier')
var updater = require('./atom-lib/updater')
var path = require('path')

var appQuit = false

updater
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
  app.on('before-quit', function () {
    appQuit = true
  })
  console.log('Version ' + version)
  updater.setFeedUrl('http://orbital.b00st.io/rokt33r/boost-dev/latest?version=' + version)
  updater.checkForUpdates()
  // menu start
  var template = require('./atom-lib/menu-template')

  ipc.on('update-app', function (event, msg) {
    if (update != null) {
      appQuit = true
      update()
    }
  })

  menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
  // menu end
  appIcon = new Tray(__dirname + '/resources/tray-icon.png')
  appIcon.setToolTip('Boost')

  var trayMenu = new Menu()
  trayMenu.append(new MenuItem({
    label: 'Open main window',
    click: function () {
      if (mainWindow != null) mainWindow.show()
    }
  }))
  trayMenu.append(new MenuItem({
    label: 'Quit',
    click: function () {
      app.quit()
    }
  }))
  appIcon.setContextMenu(trayMenu)

  mainWindow = require('./atom-lib/main-window')
  mainWindow.on('close', function (e) {
    if (appQuit) return true
    e.preventDefault()
    mainWindow.hide()
  })
  if (update != null) {
    mainWindow.webContents.on('did-finish-load', function () {
      mainWindow.webContents.send('update-available', 'whoooooooh!')
    })
  }

  app.on('activate-with-no-open-windows', function () {
    if (mainWindow == null) return null
    mainWindow.show()
  })

  // finderWindow = require('./atom-lib/finder-window')

  // var globalShortcut = require('global-shortcut')
  // console.log('jetpack launch')
  // var userDataPath = app.getPath('userData')
  // if (!jetpack.cwd(userDataPath).exists('keymap.json')) {
  //   jetpack.cwd(userDataPath).file('keymap.json', {content: '{}'})
  // }
  // try {
  //   global.keymap = JSON.parse(jetpack.cwd(userDataPath).read('keymap.json', 'utf-8'))
  // } catch (err) {
  //   jetpack.cwd(userDataPath).file('keymap.json', {content: '{}'})
  //   global.keymap = {}
  // }
  // if (global.keymap.toggleFinder == null) global.keymap.toggleFinder = 'ctrl+tab+shift'
  // var toggleFinderKey = global.keymap.toggleFinder

  // try {
  //   globalShortcut.register(toggleFinderKey, function () {
  //     if (mainWindow != null && !mainWindow.isFocused()) {
  //       mainWindow.hide()
  //     }
  //     finderWindow.show()
  //   })
  // } catch (err) {
  //   console.log(err.name)
  // }

  // ipc.on('hotkeyUpdated', function (event, newKeymap) {
  //   console.log('got new keymap')
  //   console.log(newKeymap)
  //   globalShortcut.unregisterAll()
  //   global.keymap = JSON.parse(newKeymap)
  //   jetpack.cwd(userDataPath).file('keymap.json', {content: JSON.stringify(global.keymap)})

  //   var toggleFinderKey = global.keymap.toggleFinder != null ? global.keymap.toggleFinder : 'ctrl+tab+shift'
  //   try {
  //     globalShortcut.register(toggleFinderKey, function () {
  //       if (mainWindow != null && !mainWindow.isFocused()) {
  //         mainWindow.hide()
  //       }
  //       finderWindow.show()
  //     })
  //   } catch (err) {
  //     console.log(err.name)
  //   }
  // })

  // global.hideFinder = function () {
  //   if (!mainWindow.isVisible()) {
  //     Menu.sendActionToFirstResponder('hide:')
  //   } else {
  //     mainWindow.focus()
  //   }
  // }
})
