const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const ipc = electron.ipcMain
const autoUpdater = electron.autoUpdater
const path = require('path')
const ChildProcess = require('child_process')
const _ = require('lodash')
const GhReleases = require('electron-gh-releases')
// electron.crashReporter.start()

var mainWindow = null
var finderProcess = null
var finderWindow = null

const appRootPath = path.join(process.execPath, '../..')
const updateDotExePath = path.join(appRootPath, 'Update.exe')
const exeName = path.basename(process.execPath)

// For windows app
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

  var squirrelCommand = process.argv[1]
  switch (squirrelCommand) {
    case '--squirrel-install':
      spawnUpdate(['--createShortcut', exeName], function (err) {
      app.quit()
      })
      return true
    case '--squirrel-updated':
      app.quit()
      return true
    case '--squirrel-uninstall':
      spawnUpdate(['--removeShortcut', exeName], function (err) {
      app.quit()
      })
      return true
    case '--squirrel-obsolete':
      app.quit()
      return true
  }
}

if (handleStartupEvent()) {
  return
}

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
  if (mainWindow) {
    if (process.platform === 'win32') {
      mainWindow.minimize()
      mainWindow.restore()
    }
    mainWindow.focus()
  }
  return true
})

if (shouldQuit) {
  if (mainWindow != null) mainWindow.removeAllListeners()
  app.quit()
  return
}

var version = app.getVersion()
var versionText = (version == null || version.length === 0) ? 'DEV version' : 'v' + version

var isUpdateReady = false

var ghReleasesOpts = {
  repo: 'BoostIO/boost-releases',
  currentVersion: app.getVersion()
}

const updater = new GhReleases(ghReleasesOpts)

// Check for updates
// `status` returns true if there is a new update available
function checkUpdate () {
  if (process.platform === 'linux') {
    return true
  }
  updater.check((err, status) => {
    if (err) {
      var isLatest = err.message === 'There is no newer version.'
      if (!isLatest) console.error('Updater error! %s', err.message)
    }
    if (!err) {
      if (status) {
        // Download start
        mainWindow.webContents.send('update-found', 'Update found!')
        updater.download()
      } else {
        // Latest version
      }
    }
  })
}

updater.on('update-downloaded', (info) => {
  if (mainWindow != null) {
    mainWindow.webContents.send('update-ready', 'Update available!')
    isUpdateReady = true
  }
})


function spawnFinder() {
  if (process.platform === 'darwin') {
    var finderArgv = [path.join(__dirname, 'finder-app.js'), '--finder']
    if (_.find(process.argv, a => a === '--hot')) finderArgv.push('--hot')
    finderProcess = ChildProcess
      .execFile(process.execPath, finderArgv)
  }
}

app.on('ready', function () {
  var template = require('./main-menu')
  var menu = Menu.buildFromTemplate(template)
  if (process.platform === 'darwin' || process.platform === 'linux') {
    Menu.setApplicationMenu(menu)
  }

  // Check update every 24 hours
  setInterval(function () {
    checkUpdate()
  }, 1000 * 60 * 60 * 24)

  ipc.on('check-update', function (event, msg) {
    checkUpdate()
  })

  ipc.on('update-app-confirm', function (event, msg) {
    if (isUpdateReady) {
      mainWindow.removeAllListeners()
      updater.install()
    }
  })

  ipc.on('quit-app-confirm', function () {
    mainWindow.removeAllListeners()
    app.quit()
  })

  checkUpdate()

  mainWindow = require('./main-window')
  if (process.platform === 'win32' || process.platform === 'linux') {
    mainWindow.setMenu(menu)
  }

  switch (process.platform) {
    case 'darwin':
      spawnFinder()
      break
    case 'win32':
      finderWindow = require('./finder-window')
      finderWindow.on('close', function (e) {
        e.preventDefault()
        finderWindow.hide()
      })
      break
    case 'linux':
      // Finder is available on cinnamon only.
      if (process.env.DESKTOP_SESSION === 'cinnamon') {
        finderWindow = require('./finder-window')
      }
  }

  require('./hotkey')
})

module.exports = app

