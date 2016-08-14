import store from 'browser/main/store'
import ConfigManager from 'browser/main/lib/ConfigManager'

const nodeIpc = require('node-ipc')
const { remote, ipcRenderer } = require('electron')
const { app, Menu } = remote
const path = require('path')

nodeIpc.config.id = 'node'
nodeIpc.config.retry = 1500
nodeIpc.config.silent = true
console.log('Initializing IPC Server')

// TODO: IPC SERVER WILL BE MOVED TO MAIN PROCESS FROM MAIN WINDOW PROCESS(RENDERER)
nodeIpc.serve(
  path.join(app.getPath('userData'), 'boostnote.service'),
  function () {
    console.log('IPC Server Started')
    ipcRenderer.on('open-finder', function () {
      console.log('Open finder')
      nodeIpc.server.broadcast('open-finder')
    })

    /** Quit Sequence
    1. `quit-app` Main process -> Main window by Electron IPC
    2. `quit-finder-app` Main window -> Finder window by Node IPC(socket)
    3. Finder window (and Finder main process: OSX only) killed by remote API
    4. `quit-finder-app-confirm` Finder window -> Main window by NodeIPC
    5. `quit-app-confirm` Main window -> Main process by Electron IPC
    6. Main process discard close preventer and terminate Main window and itself.

    If the platform is a linux without cinnamon, the app will skip 2.-4. because it doesn't launch finder window.
    `quit-app` will fires directly `quit-app-confirm`.
    */
    ipcRenderer.on('quit-app', function () {
      // Finder app exists only in the linux with cinnamon.
      if (global.process.env.platform === 'linux' && global.process.env.DESKTOP_SESSION !== 'cinnamon') {
        ipcRenderer.send('quit-app-confirm')
        return
      }
      let confirmHandler = function () {
        ipcRenderer.send('quit-app-confirm')
      }
      nodeIpc.server.on('quit-finder-app-confirm', confirmHandler)
      setTimeout(() => {
        nodeIpc.server.removeListener('quit-finder-app-confirm', confirmHandler)
      }, 1000)
      nodeIpc.server.broadcast('quit-finder-app')
    })

    /** Update Sequence
    1. `update-ready` Main process -> Main window by Electron IPC
    2. `update-app` Main window -> Main window by Electron IPC
    3. `quit-finder-app` Main window -> Finder window by Node IPC
    4. Finder window (and Finder main process: OSX only) killed by remote API
    5. `quit-finder-app-confirm` Finder window -> Main window by NodeIPC
    6. `update-app-confirm` Main window -> Main process by Electron IPC
    7. Main process discard close preventer and start updating.

    Handlers of 1. and 2. can be found in StatusBar component.
    */
    ipcRenderer.on('update-app', function () {
      // Linux app doesn't support auto updater
      if (global.process.env.platform === 'linux') {
        return
      }
      let confirmHandler = function () {
        ipcRenderer.send('update-app-confirm')
      }
      nodeIpc.server.on('quit-finder-app-confirm', confirmHandler)
      setTimeout(() => {
        nodeIpc.server.removeListener('quit-finder-app-confirm', confirmHandler)
      }, 1000)
      nodeIpc.server.broadcast('quit-finder-app')
    })

    ipcRenderer.on('update-found', function () {
      console.log('Update found')
    })

    let config = ConfigManager.get()
    nodeIpc.server.broadcast('config-renew', config)
    ipcRenderer.send('config-renew', {
      config: config,
      silent: true
    })
    ipcRenderer.on('config-renew', function (e, data) {
      nodeIpc.server.broadcast('config-renew', data.config)
      ipcRenderer.send('config-renew', data)
    })

    nodeIpc.server.on('open-main-from-finder', function () {
      let mainWindow = remote.getCurrentWindow()
      console.log('open main from finder')
      if (mainWindow.isFocused()) {
        if (global.process.platform === 'darwin') {
          Menu.sendActionToFirstResponder('hide:')
        } else {
          mainWindow.minimize()
        }
      } else {
        if (global.process.platform === 'darwin') {
          mainWindow.show()
        } else {
          mainWindow.minimize()
          mainWindow.restore()
        }
      }
    })

    nodeIpc.server.on('quit-from-finder', function () {
      ipcRenderer.send('quit-app-confirm')
    })

    nodeIpc.server.on('connect', function (socket) {
      console.log('connected')
      nodeIpc.server.broadcast('config-renew', ConfigManager.get())
      socket.on('close', function () {
        console.log('socket dead')
      })
    })
    nodeIpc.server.on('error', function (err) {
      console.error('Node IPC error', err)
    })
    nodeIpc.server.on('request-data', function (data, socket) {
      let state = store.getState()
      nodeIpc.server.broadcast('throttle-data', {
        storages: state.storages,
        notes: state.notes
      })
    })
  }
)
const ipc = {

}

nodeIpc.server.start()
module.exports = ipc
