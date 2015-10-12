import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { updateUser } from './HomeContainer/actions'
import reducer from './HomeContainer/reducer'
import Hq from './Services/Hq'
import { Router, Route, IndexRoute } from 'react-router'
import MainContainer from './Containers/MainContainer'
import LoginContainer from './Containers/LoginContainer'
import SignupContainer from './Containers/SignupContainer'
import HomeContainer from './HomeContainer'
require('../styles/main/index.styl')

function onlyUser (state, replaceState) {
  var currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (currentUser == null) replaceState('login', '/login')
  if (state.location.pathname === '/') replaceState('user', '/users/' + currentUser.id)
}

let routes = (
  <Route path='/' component={MainContainer}>
    <Route name='login' path='login' component={LoginContainer}/>
    <Route name='signup' path='signup' component={SignupContainer}/>
    <IndexRoute name='home' component={HomeContainer} onEnter={onlyUser}/>
    <Route name='user' path='/users/:userId' component={HomeContainer} onEnter={onlyUser}/>
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
    <DevTools store={store} monitor={LogMonitor} />
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
  Hq.getUser()
    .then(function (res) {
      store.dispatch(updateUser(res.body))
    })
    .catch(function (err) {
      console.error(err.message)
      console.log('Fetch failed')
    })
})
