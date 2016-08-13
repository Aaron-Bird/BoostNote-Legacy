const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const path = require('path')

var mainWindow = new BrowserWindow({
  width: 1080,
  height: 720,
  minWidth: 420,
  minHeight: 320,
  webPreferences: {
    zoomFactor: 1.0,
    blinkFeatures: 'OverlayScrollbars'
  }
})

const url = path.resolve(__dirname, './main.html')

mainWindow.loadURL('file://' + url)

mainWindow.webContents.on('new-window', function (e) {
  e.preventDefault()
})

mainWindow.webContents.sendInputEvent({
  type: 'keyDown',
  keyCode: '\u0008'
})

mainWindow.webContents.sendInputEvent({
  type: 'keyUp',
  keyCode: '\u0008'
})

mainWindow.on('close', function (e) {
  mainWindow.hide()
  e.preventDefault()
})

app.on('activate', function () {
  if (mainWindow == null) return null
  mainWindow.show()
})

module.exports = mainWindow
