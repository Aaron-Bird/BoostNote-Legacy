const electron = require('electron')
const ipc = electron.ipcMain
const Menu = electron.Menu
const globalShortcut = electron.globalShortcut
const mainWindow = require('./main-window')
// const nodeIpc = require('@rokt33r/node-ipc')

function emitToFinder (type, data) {
  var payload = {
    type: type,
    data: data
  }

  // nodeIpc.server.broadcast('message', payload)
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
    mainWindow.webContents.send('top-focus-search')
  }
}

ipc.on('CONFIG_RENEW', (e, payload) => {
  globalShortcut.unregisterAll()
  var { config } = payload

  var errors = []
  try {
    globalShortcut.register(config.hotkey.toggleFinder, toggleFinder)
  } catch (err) {
    errors.push('toggleFinder')
  }
  try {
    globalShortcut.register(config.hotkey.toggleMain, toggleMain)
  } catch (err) {
    errors.push('toggleMain')
  }
  if (!config.silent) {
    if (errors.length === 0) {
      mainWindow.webContents.send('APP_SETTING_DONE', {})
    } else {
      mainWindow.webContents.send('APP_SETTING_ERROR', {
        message: 'Failed to apply hotkey: ' + errors.join(' ')
      })
    }
  }
})
