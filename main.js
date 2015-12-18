const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const ipc = electron.ipcMain
const autoUpdater = electron.autoUpdater
const path = require('path')
const ChildProcess = require('child_process')
const _ = require('lodash')
// electron.crashReporter.start()

var mainWindow = null
var finderProcess = null
var finderWindow = null
var update = null

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })

const appRootPath = path.join(process.execPath, '../..')
const updateDotExePath = path.join(appRootPath, 'Update.exe')
const exeName = path.basename(process.execPath)

function spawnUpdate (args, cb) {
  var stdout = ''
  var updateProcess = null
  try {
    updateProcess = ChildProcess.spawn(updateDotExePath, args)
  } catch (e) {
    process.nextTick(function () {
      cb(e)
    })
  }

  updateProcess.stdout.on('data', function (data) {
    stdout += data
  })

  error = null
  updateProcess.on('error', function (_error) {
    error = _error
  })
  updateProcess.on('close', function (code, signal) {
    if (code !== 0) {
      error = new Error("Command failed: #{signal ? code}")
      error.code = code
      error.stdout = stdout
    }

    cb(error, stdout)
  })
}

var handleStartupEvent = function () {
  if (process.platform !== 'win32') {
    return false
  }

  var squirrelCommand = process.argv[1];
  switch (squirrelCommand) {
    case '--squirrel-install':
      spawnUpdate(['--createShortcut', exeName], function (err) {
        quitApp()
      })
      return true
    case '--squirrel-updated':
      quitApp()
      return true
    case '--squirrel-uninstall':
      spawnUpdate(['--removeShortcut', exeName], function (err) {
        quitApp()
      })
      quitApp()
      return true
    case '--squirrel-obsolete':
      quitApp()
      return true
  }
}

if (handleStartupEvent()) {
  return
}

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
  return true
})

if (shouldQuit) {
  app.quit()
  return
}

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

var isUpdateReady = false
if (process.platform === 'darwin') {
  autoUpdater.setFeedURL('https://orbital.b00st.io/rokt33r/boost-app/latest?version=' + version)
  autoUpdater
    .on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
      update = quitAndUpdate

      if (mainWindow != null) {
        notify('Ready to Update! ' + releaseName, 'Click update button on Main window.')
        mainWindow.webContents.send('update-available', 'Update available!')
      }
    })
    .on('error', function (err, message) {
      console.error('error')
      console.error(err)
      if (!versionNotified) {
        notify('Updater error!', message)
      }
    })
    .on('update-available', function () {
      notify('Update is available!', 'Download started.. wait for the update ready.')
    })
    .on('update-not-available', function () {
      if (!versionNotified) {
        versionNotified = true
        notify('Latest Build!! ' + versionText, 'Hope you to enjoy our app :D')
      }
    })
} else if (process.platform === 'win32') {
  var GhReleases = require('electron-gh-releases')

  var ghReleasesOpts = {
    repo: 'BoostIO/boost-releases',
    currentVersion: app.getVersion()
  }

  const updater = new GhReleases(ghReleasesOpts)

  // Check for updates
  // `status` returns true if there is a new update available
  function checkUpdate () {
    updater.check((err, status) => {
      if (err) {
        console.error(err)
        if (!versionNotified) notify('Updater error!', message)
      }
      if (!err) {
        if (status) {
          notify('Update is available!', 'Download started.. wait for the update ready.')
          updater.download()
        } else {
          if (!versionNotified) {
            versionNotified = true
            notify('Latest Build!! ' + versionText, 'Hope you to enjoy our app :D')
          }
        }
      }
    })
  }

  updater.on('update-downloaded', (info) => {
    if (mainWindow != null) {
      notify('Ready to Update! ' + releaseName, 'Click update button on Main window.')
      mainWindow.webContents.send('update-available', 'Update available!')
      isUpdateReady = true
    }
  })
}

const nodeIpc = require('@rokt33r/node-ipc')
nodeIpc.config.id = 'node'
nodeIpc.config.retry = 1500
// nodeIpc.config.silent = true

nodeIpc.serve(
  path.join(app.getPath('userData'), 'boost.service'),
  function () {
    nodeIpc.server.on(
      'message',
      function (data, socket) {
        console.log('>>', data)
        format(data)
      }
    )
    nodeIpc.server.on(
      'error',
      function (err) {
        console.log('>>', err)
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
      quitApp()
      break
  }
}
function quitApp () {
  appQuit = true
  if (finderProcess) finderProcess.kill()
  app.quit()
}

app.on('ready', function () {
  app.on('before-quit', function () {
    if (finderProcess) finderProcess.kill()
    appQuit = true
  })

  var template = require('./atom-lib/menu-template')
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  if (process.platform === 'darwin') {
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

    autoUpdater.checkForUpdates()
  } else if (process.platform === 'win32') {
    setInterval(function () {
      checkUpdate()
    }, 1000 * 60 * 60 * 24)

    ipc.on('check-update', function (event, msg) {
      if (update == null) checkUpdate()
    })

    ipc.on('update-app', function (event, msg) {
      if (isUpdateReady) {
        appQuit = true
        update.install()
      }
    })

    checkUpdate()
  }

  mainWindow = require('./atom-lib/main-window')
  mainWindow.on('close', function (e) {
    if (appQuit) return true
    e.preventDefault()
    mainWindow.hide()
  })

  mainWindow.webContents.on('did-finish-load', function () {
    if (finderProcess == null && process.platform === 'darwin') {
      var finderArgv = [path.join(__dirname, 'finder.js'), '--finder']
      if (_.find(process.argv, a => a === '--hot')) finderArgv.push('--hot')
      finderProcess = ChildProcess
        .execFile(process.execPath, finderArgv)
    } else {
      finderWindow = require('./atom-lib/finder-window')

      finderWindow.on('close', function (e) {
        if (appQuit) return true
        e.preventDefault()
        finderWindow.hide()
      })
    }

    nodeIpc.server.start(function (err) {
      if (err.code === 'EADDRINUSE') {
        notify('Error occurs!', 'You have to kill other Boostnote processes.')
        quitApp()
      }
    })

  })

  require('./hotkey')
})
