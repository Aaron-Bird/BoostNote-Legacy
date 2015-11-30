const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const path = require('path')

var mainWindow = new BrowserWindow({
  width: 1080,
  height: 720,
  'zoom-factor': 1.0,
  'web-preferences': {
    'overlay-scrollbars': true
  },
  'standard-window': false
})

const url = path.resolve(__dirname, '../browser/main/index.html')

mainWindow.loadURL('file://' + url)

mainWindow.webContents.on('new-window', function (e) {
  e.preventDefault()
})

module.exports = mainWindow
