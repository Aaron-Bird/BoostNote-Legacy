var autoUpdater = require('auto-updater')
var nn = require('node-notifier')
var app = require('app')
var path = require('path')

var version = app.getVersion()
var versionText = (version == null || version.length === 0) ? 'DEV version' : 'v' + version

autoUpdater
  .on('error', function (err, message) {
    console.error(err)
    console.error(message)
    nn.notify({
      title: 'Error! ' + versionText,
      icon: path.join(__dirname, 'browser/main/resources/favicon-230x230.png'),
      message: message
    })
  })
  // .on('checking-for-update', function () {
  //   // Connecting
  // })
  .on('update-available', function () {
    nn.notify({
      title: 'Update is available!! ' + versionText,
      icon: path.join(__dirname, 'browser/main/resources/favicon-230x230.png'),
      message: 'Download started.. wait for the update ready.'
    })
  })
  .on('update-not-available', function () {
    nn.notify({
      title: 'Latest Build!! ' + versionText,
      icon: path.join(__dirname, 'browser/main/resources/favicon-230x230.png'),
      message: 'Hope you to enjoy our app :D'
    })
  })

module.exports = autoUpdater
