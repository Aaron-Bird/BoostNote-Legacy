const electron = require('electron')
const app = electron.app

app.on('ready', function () {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }

  finderWindow = require('./finder-window')
})

module.exports = app
