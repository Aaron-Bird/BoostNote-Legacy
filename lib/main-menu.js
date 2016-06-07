const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const shell = electron.shell
const mainWindow = require('./main-window')

const OSX = process.platform === 'darwin'
// const WIN = process.platform === 'win32'
const LINUX = process.platform === 'linux'

var boost = {
  label: 'Boostnote',
  submenu: [
    {
      label: 'About Boostnote',
      selector: 'orderFrontStandardAboutPanel:'
    },
    {
      type: 'separator'
    },
    {
      label: 'Hide Boostnote',
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
}

var file = {
  label: 'File',
  submenu: [
    {
      label: 'New Post',
      accelerator: OSX ? 'Command + N' : 'Control + N',
      click: function () {
        mainWindow.webContents.send('top-new-post')
      }
    },
    {
      label: 'New Folder',
      accelerator: OSX ? 'Command + Shift + N' : 'Control + Shift + N',
      click: function () {
        mainWindow.webContents.send('nav-new-folder')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Delete Post',
      accelerator: OSX ? 'Control + Backspace' : 'Control + Delete',
      click: function () {
        mainWindow.webContents.send('detail-delete')
      }
    }
  ]
}

if (LINUX) {
  file.submenu.push({
    type: 'separator'
  })
  file.submenu.push({
    label: 'Quit Boostnote',
    accelerator: 'Control + Q',
    click: function () {
      mainWindow.close()
    }
  })
}

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
        mainWindow.webContents.send('top-focus-search')
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
    },
    {
      label: 'Toggle Developer Tools',
      accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
      click(item, focusedWindow) {
        if (focusedWindow)
          focusedWindow.webContents.toggleDevTools();
      }
    }
  ]
}

var window = {
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
}

var help = {
  label: 'Help',
  role: 'help',
  submenu: [
    {
      label: 'Boostnote official site',
      click: function () { shell.openExternal('https://b00st.io/') }
    },
    {
      label: 'Tutorial page',
      click: function () { shell.openExternal('https://b00st.io/tutorial.html') }
    },
    {
      label: 'Discussions',
      click: function () { shell.openExternal('https://github.com/BoostIO/boost-app-discussions/issues') }
    },
    {
      label: 'Changelog',
      click: function () { shell.openExternal('https://github.com/BoostIO/boost-releases') }
    }
  ]
}

module.exports = process.platform === 'darwin'
  ? [boost, file, edit, view, window, help]
  : process.platform === 'win32'
  ? [file, view, help]
  : [file, view, help]
