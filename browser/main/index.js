import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { updateUser, refreshArticles } from './actions'
import reducer from './reducer'
import { fetchCurrentUser, fetchArticles } from 'boost/api'
import { Router, Route, IndexRoute } from 'react-router'
import MainPage from './MainPage'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import HomePage from './HomePage'
require('../styles/main/index.styl')

function onlyUser (state, replaceState) {
  var currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (currentUser == null) replaceState('login', '/login')
  if (state.location.pathname === '/') replaceState('user', '/users/' + currentUser.id)
}

let routes = (
  <Route path='/' component={MainPage}>
    <Route name='login' path='login' component={LoginPage}/>
    <Route name='signup' path='signup' component={SignupPage}/>
    <IndexRoute name='home' component={HomePage} onEnter={onlyUser}/>
    <Route name='user' path='/users/:userId' component={HomePage} onEnter={onlyUser}/>
  </Route>
)

// with Dev
import { compose } from 'redux'
// Redux DevTools store enhancers
import { devTools, persistState } from 'redux-devtools'
// React components for Redux DevTools
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react'

let finalCreateStore = compose(devTools(), persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)))(createStore)
let store = finalCreateStore(reducer)
let devEl = (
  <DebugPanel top right bottom>
    <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false}/>
  </DebugPanel>
)

// On production
// let store = createStore(reducer)

let el = document.getElementById('content')

React.render((
  <div>
    <Provider store={store}>
      {() => <Router>{routes}</Router>}
    </Provider>
    {devEl}
  </div>
), el, function () {
  let loadingCover = document.getElementById('loadingCover')
  loadingCover.parentNode.removeChild(loadingCover)

  // Refresh user information
  fetchCurrentUser()
    .then(function (res) {
      let user = res.body
      store.dispatch(updateUser(user))

      let users = [user].concat(user.Teams)
      users.forEach(user => {
        fetchArticles(user.id)
          .then(res => {
            store.dispatch(refreshArticles(user.id, res.body))
          })
          .catch(err => {
            if (err.status == null) throw err
            console.error(err)
          })
      })
    })
    .catch(function (err) {
      console.error(err.message)
      console.log('Fetch failed')
    })
})
