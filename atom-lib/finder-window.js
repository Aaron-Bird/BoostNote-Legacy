const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const path = require('path')

var config = {
  width: 640,
  height: 400,
  show: false,
  frame: false,
  resizable: false,
  'zoom-factor': 1.0,
  'web-preferences': {
    'overlay-scrollbars': true,
    'skip-taskbar': true
  },
  'standard-window': false
}

if (process.platform === 'darwin') {
  config['always-on-top'] = true
}

var finderWindow = new BrowserWindow(config)

var url = path.resolve(__dirname, '../browser/finder/index.html')

finderWindow.loadURL('file://' + url)

if (process.platform === 'darwin') {
  finderWindow.setVisibleOnAllWorkspaces(true)
}

module.exports = finderWindow
