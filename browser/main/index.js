import { Provider } from 'react-redux'
import Main from './Main'
import store from './store'
import React from 'react'
import ReactDOM from 'react-dom'
require('!!style!css!stylus?sourceMap!../styles/main/index.styl')
import activityRecord from 'browser/lib/activityRecord'
import fetchConfig from '../lib/fetchConfig'
import { Router, Route, IndexRoute, IndexRedirect, hashHistory } from 'react-router'
const electron = require('electron')
const ipc = electron.ipcRenderer
const path = require('path')
import { syncHistoryWithStore } from 'react-router-redux'

const PRO = process.env.NODE_ENV === 'production'
if (!PRO) require('devtron').install()

const remote = electron.remote

let config = fetchConfig()
applyConfig(config)

ipc.on('config-apply', function (e, newConfig) {
  config = newConfig
  applyConfig(config)
})

function applyConfig (config) {
  let body = document.body
  body.setAttribute('data-theme', config['theme-ui'])

  let hljsCss = document.getElementById('hljs-css')
  hljsCss.setAttribute('href', '../node_modules/highlight.js/styles/' + config['theme-code'] + '.css')
}

if (process.env.NODE_ENV !== 'production') {
  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 73 && e.metaKey && e.altKey) {
      remote.getCurrentWindow().toggleDevTools()
    }
  })
}

activityRecord.init()
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
const history = syncHistoryWithStore(hashHistory, store)
history.listen((location) => console.info(location))
ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={Main}>
        <IndexRedirect to='/home'/>
        <Route path='home'/>
        <Route path='starred'/>
        <Route path='repositories'>
          <IndexRedirect to='/home'/>
          <Route path=':repositoryKey'>
            <IndexRoute/>
            <Route path='settings'/>
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
