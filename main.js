var app = require('app')  // Module to control application life.
var BrowserWindow = require('browser-window')  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })


app.on('ready', function () {
  makeNewMainWindow()

  function makeNewMainWindow () {
    console.log('new Window!')
    mainWindow = new BrowserWindow({
      width: 920,
      height: 640,
      'web-preferences': {
          'overlay-scrollbars': true
        }
      })

    mainWindow.loadUrl('file://' + __dirname + '/browser/main/index.electron.html')

    mainWindow.on('closed', function () {
      console.log('main closed')
      mainWindow = null
      app.dock.hide()
    })
    app.dock.show()
  }
})
