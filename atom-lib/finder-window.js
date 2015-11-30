const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const path = require('path')

var finderWindow = new BrowserWindow({
  width: 640,
  height: 400,
  show: false,
  frame: false,
  resizable: false,
  'zoom-factor': 1.0,
  'always-on-top': true,
  'web-preferences': {
    'overlay-scrollbars': true,
    'skip-taskbar': true
  },
  'standard-window': false
})

var url = path.resolve(__dirname, '../browser/finder/index.html')

finderWindow.loadURL('file://' + url)

finderWindow.on('blur', function () {
  finderWindow.hide()
})

module.exports = finderWindow
