const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const ipc = electron.ipcMain
const globalShortcut = electron.globalShortcut
const jetpack = require('fs-jetpack')
const path = require('path')
const mainWindow = require('./atom-lib/main-window')
const nodeIpc = require('@rokt33r/node-ipc')

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


function emitToFinder (type, data) {
  var payload = {
    type: type,
    data: data
  }
  nodeIpc.server.broadcast('message', payload)
}
