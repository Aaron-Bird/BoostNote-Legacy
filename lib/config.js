const electron = require('electron')
const app = electron.app
const ipc = electron.ipcMain
const jetpack = require('fs-jetpack')
const mainWindow = require('./main-window')

const defaultConfig = {
  'editor-font-size': '14',
  'editor-font-family': 'Monaco, Ubuntu Mono, Consolas, source-code-pro, monospace',
  'editor-indent-type': 'space',
  'editor-indent-size': '4',
  'preview-font-size': '14',
  'preview-font-family': 'Lato, helvetica, arial, sans-serif',
  'disable-direct-write': false
}
const configFile = 'config.json'

var userDataPath = app.getPath('userData')

function getConfig () {
  var userDataPath = app.getPath('userData')
  if (jetpack.cwd(userDataPath).exists(configFile)) {
    try {
      return JSON.parse(jetpack.cwd(userDataPath).read(configFile, 'utf-8'))
    } catch (err) {}
  }
  return {}
}

function saveConfig () {
  var content
  try {
    content = JSON.stringify(global.config)
  } catch (e) {
    global.config = {}
    content = JSON.stringify(global.config)
  }
  jetpack.cwd(userDataPath).file(configFile, { content })
}

// Init
global.config = Object.assign({}, defaultConfig, getConfig())

function applyConfig () {
  mainWindow.webContents.send('config-apply')
}

ipc.on('configUpdated', function (event, newConfig) {
  global.config = Object.assign({}, defaultConfig, global.config, newConfig)
  saveConfig()
  applyConfig()
})

