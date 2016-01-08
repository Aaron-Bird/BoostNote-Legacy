const electron = require('electron')
const app = electron.app
const ipc = electron.ipcMain
const Menu = electron.Menu
const globalShortcut = electron.globalShortcut
const jetpack = require('fs-jetpack')
const mainWindow = require('./main-window')
const nodeIpc = require('@rokt33r/node-ipc')

const defaultKeymap = {
  toggleFinder: 'Cmd + alt + s',
  toggleMain: 'Cmd + alt + v'
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

function registerKey (name, callback, broadcast) {
  if (broadcast == null) broadcast = true

  try {
    globalShortcut.register(global.keymap[name], callback)
    if (broadcast) {
      mainWindow.webContents.send('APP_SETTING_DONE', {})
    }
  } catch (err) {
    console.log(err)
    if (broadcast) {
      mainWindow.webContents.send('APP_SETTING_ERROR', {
        message: 'Failed to apply hotkey: Invalid format'
      })
    }
  }
}

function registerAllKeys (broadcast) {
  if (broadcast == null) broadcast = true
  registerKey('toggleFinder', toggleFinder, broadcast)
  registerKey('toggleMain', toggleMain, broadcast)
}

registerAllKeys(false)

ipc.on('hotkeyUpdated', function (event, newKeymap) {
  global.keymap = Object.assign({}, defaultKeymap, global.keymap, newKeymap)
  saveKeymap()
  globalShortcut.unregisterAll()
  registerAllKeys()
})

