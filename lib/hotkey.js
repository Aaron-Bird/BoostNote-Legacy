const electron = require('electron')
const app = electron.app
const ipc = electron.ipcMain
const Menu = electron.Menu
const globalShortcut = electron.globalShortcut
const jetpack = require('fs-jetpack')
const mainWindow = require('./main-window')
const nodeIpc = require('@rokt33r/node-ipc')
const _ = require('lodash')

const OSX = global.process.platform === 'darwin'

const defaultKeymap = {
  toggleFinder: OSX ? 'Cmd + Alt + S' : 'Super + Alt + S',
  toggleMain: OSX ? 'Cmd + Alt + L' : 'Super + Alt + E'
}
const keymapFilename = 'keymap.json'

var userDataPath = app.getPath('userData')

function getKeymap () {
  var userDataPath = app.getPath('userData')
  if (jetpack.cwd(userDataPath).exists(keymapFilename)) {
    try {
      return JSON.parse(jetpack.cwd(userDataPath).read(keymapFilename, 'utf-8'))
    } catch (err) {}
  }
  return {}
}

function saveKeymap () {
  var content
  try {
    content = JSON.stringify(global.keymap)
  } catch (e) {
    global.keymap = {}
    content = JSON.stringify(global.keymap)
  }
  jetpack.cwd(userDataPath).file(keymapFilename, { content })
}

function emitToFinder (type, data) {
  var payload = {
    type: type,
    data: data
  }

  nodeIpc.server.broadcast('message', payload)
}

function toggleFinder () {
  emitToFinder('open-finder')
  mainWindow.webContents.send('open-finder', {})
}

function toggleMain () {
  if (mainWindow.isFocused()) {
    if (process.platform === 'darwin') {
      Menu.sendActionToFirstResponder('hide:')
    } else {
      mainWindow.minimize()
    }
  } else {
    if (process.platform === 'darwin') {
      mainWindow.show()
    } else {
      mainWindow.minimize()
      mainWindow.restore()
    }
    mainWindow.webContents.send('list-focus')
  }
}

// Init
global.keymap = Object.assign({}, defaultKeymap, getKeymap())

function registerKey (name, callback) {
  if (_.isString(global.keymap[name]) && global.keymap[name].trim().length > 0) {
    globalShortcut.register(global.keymap[name], callback)
  }
}

function registerAllKeys (broadcast) {
  if (broadcast == null) broadcast = true

  var errors = []
  try {
    registerKey('toggleFinder', toggleFinder)
  } catch (err) {
    errors.push('toggleFinder')
  }
  try {
    registerKey('toggleMain', toggleMain)
  } catch (err) {
    errors.push('toggleMain')
  }

  if (broadcast) {
    if (errors.length === 0) {
      mainWindow.webContents.send('APP_SETTING_DONE', {})
    } else {
      mainWindow.webContents.send('APP_SETTING_ERROR', {
        message: 'Failed to apply hotkey: ' + errors.join(' ')
      })
    }
  }
}

registerAllKeys(false)

ipc.on('hotkeyUpdated', function (event, newKeymap) {
  global.keymap = Object.assign({}, defaultKeymap, global.keymap, newKeymap)
  saveKeymap()
  globalShortcut.unregisterAll()
  registerAllKeys()
})

