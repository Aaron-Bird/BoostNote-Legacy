import React from 'react'
import { Provider } from 'react-redux'
// import { updateUser } from 'boost/actions'
import { Router, Route, IndexRoute } from 'react-router'
import MainPage from './MainPage'
import HomePage from './HomePage'
// import auth from 'boost/auth'
import store from 'boost/store'
import ReactDOM from 'react-dom'
require('../styles/main/index.styl')
import { openModal } from 'boost/modal'
import Tutorial from 'boost/components/modal/Tutorial'
import activityRecord from 'boost/activityRecord'
const electron = require('electron')
const ipc = electron.ipcRenderer

activityRecord.init()
window.addEventListener('online', function () {
  ipc.send('check-update', 'check-update')
})

function notify (...args) {
  return new window.Notification(...args)
}

ipc.on('notify', function (e, payload) {
  notify(payload.title, {
    body: payload.body
  })
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
