const electron = require('electron')
const app = electron.app
const Menu = electron.Menu

var finderWindow = null

app.on('ready', function () {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }

  var template = require('./menu-template')
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  finderWindow = require('./finder-window')
})

module.exports = app
