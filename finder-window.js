var BrowserWindow = require('browser-window')

var finderWindow = new BrowserWindow({
  width: 600,
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

finderWindow.loadUrl('file://' + __dirname + '/browser/finder/index.html')

finderWindow.on('blur', function () {
  finderWindow.hide()
})

finderWindow.setVisibleOnAllWorkspaces(true)

module.exports = finderWindow
