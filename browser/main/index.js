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

  // Refresh user information
  // if (auth.user() != null) {
  //   fetchCurrentUser()
  //     .then(function (res) {
  //       let user = res.body
  //       store.dispatch(updateUser(user))
  //     })
  //     .catch(function (err) {
  //       if (err.status === 401) {
  //         auth.clear()
  //         if (window != null) window.location.reload()
  //       }
  //       console.error(err.message)
  //       console.log('Fetch failed')
  //     })
  // }
})
