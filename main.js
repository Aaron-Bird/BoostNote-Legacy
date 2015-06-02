var app = require('app')  // Module to control application life.
var BrowserWindow = require('browser-window')  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null

console.log(process.platform)
// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin')
    app.quit()
})
app.on('ready', function () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadUrl('file://' + __dirname + '/build/index.html')

  mainWindow.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})
