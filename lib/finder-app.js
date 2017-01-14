const electron = require('electron')
const app = electron.app

app.on('ready', function () {
  if (process.platform === 'darwin') {
    app.dock.hide()
  }

  /* eslint-disable */
  finderWindow = require('./finder-window')
  /* eslint-enable */
})

module.exports = app
