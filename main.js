var app = require('app')  // Module to control application life.
var BrowserWindow = require('browser-window')  // Module to create native browser window.
var Menu = require('menu')
var Tray = require('tray')
// Report crashes to our server.
require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null

// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })

app.on('ready', function () {
  // menu start
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
          selector: 'terminate:'
        }
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
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: function () {
            BrowserWindow.getFocusedWindow().reload()
          }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click: function () {
            BrowserWindow.getFocusedWindow().toggleDevTools()
          }
        }
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
        }
      ]
    },
    {
      label: 'Help',
      submenu: []
    }
  ]

  var menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
  // menu end
  var appIcon = new Tray(__dirname + '/tray-icon.png')
  appIcon.setToolTip('This is my application.')
  appIcon.on('clicked', function () {
    if (mainWindow == null) {
      makeNewMainWindow()
    }
    mainWindow.show()
  })

  makeNewMainWindow()

  app.on('activate-with-no-open-windows', function () {
    if (mainWindow == null) {
      makeNewMainWindow()
      return
    }
    mainWindow.show()
  })

  var popUpWindow = new BrowserWindow({
    width: 600,
    height: 400,
    show: false,
    frame: false,
    'always-on-top': true,
    'web-preferences': {
        'overlay-scrollbars': true,
        'skip-taskbar': true
      }
  })

  popUpWindow.loadUrl('file://' + __dirname + '/browser/finder/index.electron.html')

  popUpWindow.on('blur', function () {
    popUpWindow.hide()
  })
  popUpWindow.setVisibleOnAllWorkspaces(true)

  var globalShortcut = require('global-shortcut')

  globalShortcut.register('ctrl+tab+shift', function () {
    if (mainWindow != null && !mainWindow.isFocused()) {
      mainWindow.hide()
    }
    popUpWindow.show()
  })

  global.hideFinder = function () {
    if (mainWindow == null || !mainWindow.isVisible()) {
      Menu.sendActionToFirstResponder('hide:')
    }
    popUpWindow.hide()
  }
})

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
