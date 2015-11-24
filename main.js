const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const ipc = electron.ipcMain
const globalShortcut = electron.globalShortcut
const autoUpdater = electron.autoUpdater
const jetpack = require('fs-jetpack')
const path = require('path')
const ChildProcess = require('child_process')
electron.crashReporter.start()

var mainWindow = null
var finderProcess
var update = null

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })

var appQuit = false

var version = app.getVersion()
var versionText = (version == null || version.length === 0) ? 'DEV version' : 'v' + version
var versionNotified = false

function notify (title, body) {
  if (mainWindow != null) {
    mainWindow.webContents.send('notify', {
      title: title,
      body: body
    })
  }
}

autoUpdater
  .on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    update = quitAndUpdate

    if (mainWindow != null) {
      notify('Ready to Update! ' + releaseName, 'Click update button on Main window.')
      mainWindow.webContents.send('update-available', 'Update available!')
    }
  })
  .on('error', function (err, message) {
    console.error(err)
    notify('Updater error!', message)
  })
  // .on('checking-for-update', function () {
  //   // Connecting
  //   console.log('checking...')
  // })
  .on('update-available', function () {
    notify('Update is available!', 'Download started.. wait for the update ready.')
  })
  .on('update-not-available', function () {
    if (mainWindow != null && !versionNotified) {
      versionNotified = true
      notify('Latest Build!! ' + versionText, 'Hope you to enjoy our app :D')
    }
  })

app.on('ready', function () {
  app.on('before-quit', function () {
    if (finderProcess) finderProcess.kill()
    appQuit = true
  })

  autoUpdater.setFeedURL('https://orbital.b00st.io/rokt33r/boost-dev/latest?version=' + version)

  var template = require('./atom-lib/menu-template')
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

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

  mainWindow = require('./atom-lib/main-window')
  mainWindow.on('close', function (e) {
    if (appQuit) return true
    e.preventDefault()
    mainWindow.hide()
  })
  mainWindow.webContents.on('did-finish-load', function () {
    if (finderProcess == null) {
      finderProcess = ChildProcess
        .execFile(process.execPath, [path.resolve(__dirname, 'finder.js'), '--finder'])
      finderProcess.stdout.setEncoding('utf8')
      finderProcess.stderr.setEncoding('utf8')
      finderProcess.stdout.on('data', format)
      finderProcess.stderr.on('data', errorFormat)
    }

    if (update != null) {
      mainWindow.webContents.send('update-available', 'whoooooooh!')
    } else {
      autoUpdater.checkForUpdates()
    }
  })

  app.on('activate', function () {
    if (mainWindow == null) return null
    mainWindow.show()
  })

  function format (payload) {
    // console.log('from finder >> ', payload)
    try {
      payload = JSON.parse(payload)
    } catch (e) {
      console.log('Not parsable payload : ', payload)
      return
    }
    switch (payload.type) {
      case 'log':
        console.log('FINDER(stdout): ' + payload.data)
        break
      case 'show-main-window':
        if (mainWindow != null) {
          mainWindow.show()
        }
        break
      case 'request-data':
        mainWindow.webContents.send('request-data')
        break
      case 'quit-app':
        appQuit = true
        app.quit()
        break
    }
  }
  function errorFormat (output) {
    console.error('FINDER(stderr):' + output)
  }

  function emitToFinder (type, data) {
    if (!finderProcess) {
      console.log('finder process is not ready')
      return
    }
    var payload = {
      type: type,
      data: data
    }
    finderProcess.stdin.write(JSON.stringify(payload), 'utf-8')
  }

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
      emitToFinder('open-finder')
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
        emitToFinder('open-finder')
      })
      mainWindow.webContents.send('APP_SETTING_DONE', {})
    } catch (err) {
      console.error(err)
      mainWindow.webContents.send('APP_SETTING_ERROR', {
        message: 'Failed to apply hotkey: Invalid format'
      })
    }
  })
})
