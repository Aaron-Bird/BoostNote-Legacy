const electron = require('electron')
const app = electron.app

app.on('ready', function () {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }
})

module.exports = app
