const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const MenuItem = electron.MenuItem
const Tray = electron.Tray
const path = require('path')

var config = {
  width: 840,
  height: 540,
  show: false,
  frame: false,
  resizable: false,
  zoomFactor: 1.0,
  webPreferences: {
    blinkFeatures: 'OverlayScrollbars'
  },
  skipTaskbar: true,
  standardWindow: false
}

if (process.platform === 'darwin') {
  config['always-on-top'] = true
}

var finderWindow = new BrowserWindow(config)

var url = path.resolve(__dirname, './finder.html')

finderWindow.loadURL('file://' + url)
finderWindow.setSkipTaskbar(true)

if (process.platform === 'darwin') {
  finderWindow.setVisibleOnAllWorkspaces(true)
}

finderWindow.on('blur', function () {
  hideFinder()
})

finderWindow.on('close', function (e) {
  e.preventDefault()
  finderWindow.hide()
})

var appIcon = new Tray(path.join(__dirname, '../resources/tray-icon.png'))
appIcon.setToolTip('Boost')

var trayMenu = new Menu()
trayMenu.append(new MenuItem({
  label: 'Open Main window',
  click: function () {
    finderWindow.webContents.send('open-main-from-tray')
  }
}))
if (process.env.platform !== 'linux' || process.env.DESKTOP_SESSION === 'cinnamon') {
  trayMenu.append(new MenuItem({
    label: 'Open Finder window',
    click: function () {
      finderWindow.webContents.send('open-finder-from-tray')
    }
  }))
}
trayMenu.append(new MenuItem({
  label: 'Quit',
  click: function () {
    finderWindow.webContents.send('quit-from-tray')
  }
}))

appIcon.setContextMenu(trayMenu)
appIcon.on('click', function (e) {
  e.preventDefault()
  appIcon.popUpContextMenu(trayMenu)
})

function hideFinder () {
  if (process.platform === 'win32') {
    finderWindow.minimize()
    return
  }
  if (process.platform === 'darwin') {
    Menu.sendActionToFirstResponder('hide:')
  }
  finderWindow.hide()
}
module.exports = finderWindow
