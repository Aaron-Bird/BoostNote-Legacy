const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const ipc = electron.ipcMain
const globalShortcut = electron.globalShortcut
const autoUpdater = electron.autoUpdater
const jetpack = require('fs-jetpack')
const path = require('path')
const ChildProcess = require('child_process')
const _ = require('lodash')
// electron.crashReporter.start()

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
    if (!versionNotified) {
      notify('Updater error!', message)
    }
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


const nodeIpc = require('node-ipc')
var isNodeIpcReady = false
nodeIpc.config.id   = 'node'
nodeIpc.config.retry= 1500
nodeIpc.config.silent = true

nodeIpc.serve(
  path.join(app.getPath('userData'), 'boost.service'),
  function(){
    isNodeIpcReady = true
    nodeIpc.server.on(
      'message',
      function (data, socket){
        console.log('>>', data)
        format(data)
      }
    )
  }
)


function format (payload) {
  switch (payload.type) {
    case 'show-main-window':
      mainWindow.minimize()
      mainWindow.restore()
      break
    case 'copy-finder':
      mainWindow.webContents.send('copy-finder')
      break
    case 'quit-app':
      appQuit = true
      app.quit()
      break
  }
}

app.on('ready', function () {
  app.on('before-quit', function () {
    if (finderProcess) finderProcess.kill()
    appQuit = true
  })
  autoUpdater.setFeedURL('https://orbital.b00st.io/rokt33r/boost-app/latest?version=' + version)

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

  function emitToFinder (type, data) {
    if (!isNodeIpcReady) {
      console.log('server is not ready')
    }
    var payload = {
      type: type,
      data: data
    }
    nodeIpc.server.broadcast('message', payload)
  }

  mainWindow.webContents.on('did-finish-load', function () {
    if (finderProcess == null) {
      var finderArgv = [path.resolve(__dirname, 'finder.js'), '--finder']
      if (_.find(process.argv, a => a === '--hot')) finderArgv.push('--hot')
      finderProcess = ChildProcess
        .execFile(process.execPath, finderArgv)

      nodeIpc.server.start()
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
      mainWindow.webContents.send('open-finder', {})
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
        mainWindow.webContents.send('open-finder', {})
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
