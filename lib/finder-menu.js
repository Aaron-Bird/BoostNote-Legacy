const electron = require('electron')
const BrowserWindow = electron.BrowserWindow

const OSX = process.platform === 'darwin'
const WIN = process.platform === 'win32'

var edit = {
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
}

var view = {
  label: 'View',
  submenu: [
    {
      label: 'Focus Search',
      accelerator: 'Control + Alt + F',
      click: function () {
        console.log('focus find')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Toggle Markdown Preview',
      accelerator: OSX ? 'Command + P' : 'Ctrl + P',
      click: function () {
        console.log('markdown')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Reload',
      accelerator: (function () {
        if (process.platform === 'darwin') return 'Command+R'
        else return 'Ctrl+R'
      })(),
      click: function () {
        BrowserWindow.getFocusedWindow().reload()
      }
    // },
    // {
    //   label: 'Toggle Developer Tools',
    //   accelerator: (function () {
    //     if (process.platform === 'darwin') return 'Alt+Command+I'
    //     else return 'Ctrl+Shift+I'
    //   })(),
    //   click: function (item, focusedWindow) {
    //     if (focusedWindow) BrowserWindow.getFocusedWindow().toggleDevTools()
    //   }
    }
  ]
}

module.exports = process.platform === 'darwin'
  ? [edit, view]
  : [view]
