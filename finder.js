const electron = require('electron')
const app = electron.app
const Tray = electron.Tray
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const ipc = electron.ipcMain

process.stdin.setEncoding('utf8')

console.log = function () {
  process.stdout.write(JSON.stringify({
    type: 'log',
    data: JSON.stringify(Array.prototype.slice.call(arguments).join(' '))
  }))
}

function emit (type, data) {
  process.stdout.write(JSON.stringify({
    type: type,
    data: JSON.stringify(data)
  }))
}

var finderWindow
app.on('ready', function () {
  app.dock.hide()
  var appIcon = new Tray(__dirname + '/resources/tray-icon.png')
  appIcon.setToolTip('Boost')

  finderWindow = require('./atom-lib/finder-window')
  finderWindow.webContents.on('did-finish-load', function () {
    var trayMenu = new Menu()
    trayMenu.append(new MenuItem({
      label: 'Open Main window',
      click: function () {
        emit('show-main-window')
      }
    }))
    trayMenu.append(new MenuItem({
      label: 'Open Finder',
      click: function () {
        finderWindow.show()
      }
    }))
    trayMenu.append(new MenuItem({
      label: 'Quit',
      click: function () {
        emit('quit-app')
      }
    }))
    appIcon.setContextMenu(trayMenu)

    ipc.on('request-data', function () {
      emit('request-data')
    })

    process.stdin.on('data', function (payload) {
      try {
        payload = JSON.parse(payload)
      } catch (e) {
        console.log('Not parsable payload : ', payload)
        return
      }
      console.log('from main >> ', payload.type)
      switch (payload.type) {
        case 'open-finder':
          finderWindow.show()
          break
        case 'refresh-data':
          finderWindow.webContents.send('refresh-data', payload.data)
          break
      }
    })

    emit('request-data')
  })

  global.hideFinder = function () {
    Menu.sendActionToFirstResponder('hide:')
  }
})

