var app = require('app')  // Module to control application life.
var BrowserWindow = require('browser-window')  // Module to create native browser window.

// Report crashes to our server.
require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

var Tray = require('tray')
var appIcon = null

app.on('ready', function () {
  appIcon = new Tray('./icon.png')
  appIcon.setToolTip('This is my application.')

  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadUrl('file://' + __dirname + '/electron_build/index.html')

  // mainWindow.openDevTools()

  mainWindow.on('closed', function () {
    console.log('main closed')
    mainWindow = null
  })

  var globalShortcut = require('global-shortcut')

  var popUpWindow = new BrowserWindow({
    width: 600,
    height: 400,
    show: false,
    frame: false
  })

  popUpWindow.loadUrl('file://' + __dirname + '/electron_build/electron/popup/index.html')

  app.on('activate-with-no-open-windows', function () {
    if (mainWindow == null) {
      console.log('new WIndow!')
      mainWindow = new BrowserWindow({width: 800, height: 600})

      mainWindow.loadUrl('file://' + __dirname + '/electron_build/index.html')

      mainWindow.on('closed', function () {
        mainWindow = null
      })
    }
    mainWindow.show()
  })

  popUpWindow.on('blur', function () {
    popUpWindow.hide()
  })

  var hidePopUp = function () {
    if(fromMain){

    } else {
      mainWindow.hide()
      Menu.sendActionToFirstResponder('hide:');
    }

    popUpWindow.hide()
  }

  var ipc = require('ipc')
  ipc.on('hidePopUp', function () {
    hidePopUp()
  })

  var fromMain
  // Register a 'ctrl+x' shortcut listener.
  var ret = globalShortcut.register('ctrl+tab+shift', function () {

    if (popUpWindow.isVisible()) {
      hidePopUp()
      return
    }
    fromMain = mainWindow.isFocused()
    popUpWindow.show()

  })
  if (!ret) console.log('registerion fails')


  // MENU
  var Menu = require('menu')
  var template = [
    {
      label: 'Electron',
      submenu: [
        {
          label: 'About Electron',
          selector: 'orderFrontStandardAboutPanel:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          label: 'Hide Electron',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        {
          label: 'Show All',
          selector: 'unhideAllApplications:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: function() { BrowserWindow.getFocusedWindow().reloadIgnoringCache(); }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click: function() { BrowserWindow.getFocusedWindow().toggleDevTools(); }
        },
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        },
      ]
    },
    {
      label: 'Help',
      submenu: []
    },
  ];

  menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu);
})
