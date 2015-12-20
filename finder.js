const electron = require('electron')
const app = electron.app
const Menu = electron.Menu

var finderWindow = null

var appQuit = false
app.on('ready', function () {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }

  var template = require('./atom-lib/menu-template')
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  finderWindow = require('./atom-lib/finder-window')

  finderWindow.on('close', function (e) {
    if (appQuit) return true
    e.preventDefault()
    finderWindow.hide()
  })
})
