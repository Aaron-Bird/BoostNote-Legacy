import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'
import MainContainer from './Containers/MainContainer'
import LoginContainer from './Containers/LoginContainer'
import SignupContainer from './Containers/SignupContainer'
import HomeContainer from './HomeContainer'

function onlyUser (state, replaceState) {
  var currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (currentUser == null) replaceState('login', '/login')
}

let routes = (
  <Route path='/' component={MainContainer}>

    <Route name='login' path='login' component={LoginContainer}/>
    <Route name='signup' path='signup' component={SignupContainer}/>
    <IndexRoute name='home' component={HomeContainer} onEnter={onlyUser}>
      <IndexRoute name='homeDefault'/>
      <Route name='user' path=':userId'/>
    </IndexRoute>
  </Route>
)

let el = document.getElementById('content')
React.render(<Router>{routes}</Router>, el, function () {
  let loadingCover = document.getElementById('loadingCover')
  loadingCover.parentNode.removeChild(loadingCover)
})
