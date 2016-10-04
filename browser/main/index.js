import { Provider } from 'react-redux'
import Main from './Main'
import store from './store'
import React from 'react'
import ReactDOM from 'react-dom'
require('!!style!css!stylus?sourceMap!./global.styl')
import { Router, Route, IndexRoute, IndexRedirect, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
require('./lib/ipcClient')

const electron = require('electron')
const ipc = electron.ipcRenderer

ipc.send('check-update', 'check-update')
window.addEventListener('online', function () {
  ipc.send('check-update', 'check-update')
})

document.addEventListener('drop', function (e) {
  e.preventDefault()
  e.stopPropagation()
})
document.addEventListener('dragover', function (e) {
  e.preventDefault()
  e.stopPropagation()
})

if (process.env !== 'production') {
  require('devtron').install()
}

let el = document.getElementById('content')
const history = syncHistoryWithStore(hashHistory, store)

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={Main}>
        <IndexRedirect to='/home'/>
        <Route path='home'/>
        <Route path='starred'/>
        <Route path='storages'>
          <IndexRedirect to='/home'/>
          <Route path=':storageKey'>
            <IndexRoute/>
            <Route path='folders/:folderKey'/>
          </Route>
        </Route>
      </Route>
    </Router>
  </Provider>
), el, function () {
  let loadingCover = document.getElementById('loadingCover')
  loadingCover.parentNode.removeChild(loadingCover)
})
