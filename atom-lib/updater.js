var autoUpdater = require('auto-updater')
var nn = require('node-notifier')
var app = require('app')
var path = require('path')

var version = app.getVersion()
var versionText = (version == null || version.length === 0) ? 'DEV version' : 'v' + version
var versionNotified = false
autoUpdater
  .on('error', function (err, message) {
    console.error(err)
    console.error(message)
    console.log(path.resolve(__dirname, '../resources/favicon-230x230.png'))
    nn.notify({
      title: 'Error! ' + versionText,
      icon: path.resolve(__dirname, '../resources/favicon-230x230.png'),
      message: message
    })
  })
  // .on('checking-for-update', function () {
  //   // Connecting
  //   console.log('checking...')
  // })
  .on('update-available', function () {
    nn.notify({
      title: 'Update is available!! ' + versionText,
      icon: path.resolve(__dirname, '../resources/favicon-230x230.png'),
      message: 'Download started.. wait for the update ready.'
    })
  })
  .on('update-not-available', function () {
    if (!versionNotified) {
      nn.notify({
        title: 'Latest Build!! ' + versionText,
        icon: path.resolve(__dirname, '../resources/favicon-230x230.png'),
        message: 'Hope you to enjoy our app :D'
      })
      versionNotified = true
    }
  })

module.exports = autoUpdater
