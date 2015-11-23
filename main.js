const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const Tray = electron.Tray
const ipc = electron.ipcMain
const globalShortcut = electron.globalShortcut
const autoUpdater = electron.autoUpdater
const jetpack = require('fs-jetpack')
electron.crashReporter.start()

var mainWindow = null
var appIcon = null
var menu = null
var finderWindow = null

var update = null

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })

var appQuit = false

var version = app.getVersion()
var versionText = (version == null || version.length === 0) ? 'DEV version' : 'v' + version
var versionNotified = false
autoUpdater
  .on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    update = quitAndUpdate

    if (mainWindow != null) {
      mainWindow.webContents.send('notify', 'Ready to Update! ' + releaseName, 'Click update button on Main window.')
      mainWindow.webContents.send('update-available', 'Update available!')
    }
  })
  .on('error', function (err, message) {
    console.error(err)
    if (mainWindow != null && !versionNotified) {
      mainWindow.webContents.send('notify', 'Updater error!', message)
    }
  })
  // .on('checking-for-update', function () {
  //   // Connecting
  //   console.log('checking...')
  // })
  .on('update-available', function () {
    if (mainWindow != null) {
      mainWindow.webContents.send('notify', 'Update is available!', 'Download started.. wait for the update ready.')
    }
  })
  .on('update-not-available', function () {
    if (mainWindow != null && !versionNotified) {
      versionNotified = true
      mainWindow.webContents.send('notify', 'Latest Build!! ' + versionText, 'Hope you to enjoy our app :D')
    }
  })

app.on('ready', function () {
  app.on('before-quit', function () {
    appQuit = true
  })
  console.log('Version ' + version)
  autoUpdater.setFeedUrl('http://orbital.b00st.io/rokt33r/boost-dev/latest?version=' + version)
  // menu start
  var template = require('./atom-lib/menu-template')

  setInterval(function () {
    if (update == null) autoUpdater.checkForUpdates()
  }, 1000 * 60 * 60 * 24)

  ipc.on('check-update', function (event, msg) {
    if (update == null) autoUpdater.checkForUpdates()
  })

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
  mainWindow.webContents.on('did-finish-load', function () {
    if (update != null) {
      mainWindow.webContents.send('update-available', 'whoooooooh!')
    } else {
      autoUpdater.checkForUpdates()
    }
  })

  app.on('activate-with-no-open-windows', function () {
    if (mainWindow == null) return null
    mainWindow.show()
  })

  finderWindow = require('./atom-lib/finder-window')

  var userDataPath = app.getPath('userData')
  if (!jetpack.cwd(userDataPath).exists('keymap.json')) {
    jetpack.cwd(userDataPath).file('keymap.json', {content: '{}'})
  }
  try {
    global.keymap = JSON.parse(jetpack.cwd(userDataPath).read('keymap.json', 'utf-8'))
  } catch (err) {
    jetpack.cwd(userDataPath).file('keymap.json', {content: '{}'})
    global.keymap = {}
  }
  if (global.keymap.toggleFinder == null) global.keymap.toggleFinder = 'ctrl+tab+shift'
  var toggleFinderKey = global.keymap.toggleFinder

  try {
    globalShortcut.register(toggleFinderKey, function () {
      if (mainWindow != null && !mainWindow.isFocused()) {
        mainWindow.hide()
      }
      finderWindow.show()
    })
  } catch (err) {
    console.log(err.name)
  }

  ipc.on('hotkeyUpdated', function (event, newKeymap) {
    console.log('got new keymap')
    console.log(newKeymap)
    globalShortcut.unregisterAll()
    global.keymap = newKeymap
    jetpack.cwd(userDataPath).file('keymap.json', {content: JSON.stringify(global.keymap)})

    var toggleFinderKey = global.keymap.toggleFinder != null ? global.keymap.toggleFinder : 'ctrl+tab+shift'
    try {
      globalShortcut.register(toggleFinderKey, function () {
        if (mainWindow != null && !mainWindow.isFocused()) {
          mainWindow.hide()
        }
        finderWindow.show()
      })
      mainWindow.webContents.send('APP_SETTING_DONE', {})
    } catch (err) {
      console.error(err)
      mainWindow.webContents.send('APP_SETTING_ERROR', {
        message: 'Failed to apply hotkey: Invalid format'
      })
    }
  })

  global.hideFinder = function () {
    if (!mainWindow.isVisible()) {
      Menu.sendActionToFirstResponder('hide:')
    } else {
      mainWindow.focus()
    }
  }
})
