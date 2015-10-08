var BrowserWindow = require('browser-window')

var mainWindow = new BrowserWindow({
  width: 1080,
  height: 720,
  'zoom-factor': 1.0,
  'web-preferences': {
    'overlay-scrollbars': true
  },
  'standard-window': false
})

mainWindow.loadUrl('file://' + __dirname + '/browser/main/index.html')

mainWindow.setVisibleOnAllWorkspaces(true)

mainWindow.webContents.on('new-window', function (e) {
  e.preventDefault()
})

module.exports = mainWindow
