import { Provider } from 'react-redux'
// import { updateUser } from 'boost/actions'
import { Router, Route, IndexRoute } from 'react-router'
import MainPage from './MainPage'
import HomePage from './HomePage'
// import auth from 'boost/auth'
import store from 'boost/store'
import React from 'react'
import ReactDOM from 'react-dom'
require('../styles/main/index.styl')
import { openModal } from 'boost/modal'
import Tutorial from 'boost/components/modal/Tutorial'
import activityRecord from 'boost/activityRecord'
const electron = require('electron')
const ipc = electron.ipcRenderer
const path = require('path')

activityRecord.init()
window.addEventListener('online', function () {
  ipc.send('check-update', 'check-update')
})

function notify (title, options) {
  if (process.platform === 'win32') {
    options.icon = path.join('file://', global.__dirname, '../../resources/favicon-230x230.png')
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

let routes = (
  <Route path='/' component={MainPage}>
    <IndexRoute name='home' component={HomePage}/>
  </Route>
)

let el = document.getElementById('content')
ReactDOM.render((
  <div>
    <Provider store={store}>
      <Router>{routes}</Router>
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
