import { Provider } from 'react-redux'
import MainPage from './MainPage'
import store from './store'
import React from 'react'
import ReactDOM from 'react-dom'
require('../styles/main/index.styl')
import { openModal } from 'browser/lib/modal'
import Tutorial from './modal/Tutorial'
import activityRecord from 'browser/lib/activityRecord'
const electron = require('electron')
const ipc = electron.ipcRenderer
const path = require('path')

activityRecord.init()
window.addEventListener('online', function () {
  ipc.send('check-update', 'check-update')
})

function notify (title, options) {
  if (process.platform === 'win32') {
    options.icon = path.join('file://', global.__dirname, '../../resources/app.png')
    options.silent = false
  }
  console.log(options)
  return new window.Notification(title, options)
}

ipc.on('notify', function (e, payload) {
  notify(payload.title, {
    body: payload.body
  })
})

ipc.on('copy-finder', function () {
  activityRecord.emit('FINDER_COPY')
})
ipc.on('open-finder', function () {
  activityRecord.emit('FINDER_OPEN')
})

let el = document.getElementById('content')
ReactDOM.render((
  <div>
    <Provider store={store}>
      <MainPage/>
    </Provider>
  </div>
), el, function () {
  let loadingCover = document.getElementById('loadingCover')
  loadingCover.parentNode.removeChild(loadingCover)
  let status = JSON.parse(localStorage.getItem('status'))
  if (status == null) status = {}
  if (!status.introWatched) {
    openModal(Tutorial)
    status.introWatched = true
    localStorage.setItem('status', JSON.stringify(status))
  }
})
