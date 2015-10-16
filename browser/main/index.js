import React from 'react'
import { Provider } from 'react-redux'
import { updateUser } from './actions'
import { fetchCurrentUser } from 'boost/api'
import { Router, Route, IndexRoute } from 'react-router'
import MainPage from './MainPage'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import HomePage from './HomePage'
import auth from 'boost/auth'
import store, { devToolElement } from './store'
require('../styles/main/index.styl')

function onlyUser (state, replaceState) {
  let currentUser = auth.user()
  if (currentUser == null) return replaceState('login', '/login')
  if (state.location.pathname === '/') return replaceState('user', '/users/' + currentUser.id)
}

let routes = (
  <Route path='/' component={MainPage}>
    <Route name='login' path='login' component={LoginPage}/>
    <Route name='signup' path='signup' component={SignupPage}/>
    <IndexRoute name='home' component={HomePage} onEnter={onlyUser}/>
    <Route name='user' path='/users/:userId' component={HomePage} onEnter={onlyUser}/>
  </Route>
)

let el = document.getElementById('content')

React.render((
  <div>
    <Provider store={store}>
      {() => <Router>{routes}</Router>}
    </Provider>
    {devToolElement}
  </div>
), el, function () {
  let loadingCover = document.getElementById('loadingCover')
  loadingCover.parentNode.removeChild(loadingCover)

  // Refresh user information
  fetchCurrentUser()
    .then(function (res) {
      let user = res.body
      store.dispatch(updateUser(user))
    })
    .catch(function (err) {
      console.error(err.message)
      console.log('Fetch failed')
    })
})
