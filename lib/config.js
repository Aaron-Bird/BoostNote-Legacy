const electron = require('electron')
const app = electron.app
const ipc = electron.ipcMain
const jetpack = require('fs-jetpack')
const nodeIpc = require('@rokt33r/node-ipc')

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
  return null
}

var config = null

function saveConfig () {
  var content
  try {
    content = JSON.stringify(config)
  } catch (e) {
    config = {}
    content = JSON.stringify(config)
  }
  jetpack.cwd(userDataPath).file(configFile, { content })
}

// Init
config = getConfig()
if (config == null) {
  config = Object.assign({}, defaultConfig)
  saveConfig()
}

config = Object.assign({}, defaultConfig, config)

if (config['disable-direct-write']) {
  app.commandLine.appendSwitch('disable-direct-write')
}

function emitToFinder (type, data) {
  var payload = {
    type: type,
    data: data
  }

  nodeIpc.server.broadcast('message', payload)
}

app.on('ready', function () {
  const mainWindow = require('./main-window')
  function applyConfig () {
    mainWindow.webContents.send('config-apply', config)
    emitToFinder('config-apply', config)
  }

  ipc.on('configUpdated', function (event, newConfig) {
    config = Object.assign({}, defaultConfig, config, newConfig)
    saveConfig()
    applyConfig()
  })
})

