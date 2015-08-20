var React = require('react/addons')

var ReactRouter = require('react-router')
var Route = ReactRouter.Route
var DefaultRoute = ReactRouter.DefaultRoute

var MainContainer = require('./Containers/MainContainer')

var LoginContainer = require('./Containers/LoginContainer')
var SignupContainer = require('./Containers/SignupContainer')

var HomeContainer = require('./Containers/HomeContainer')
var UserContainer = require('./Containers/UserContainer')

var PlanetContainer = require('./Containers/PlanetContainer')

var routes = (
  <Route path='/' handler={MainContainer}>
    <DefaultRoute name='root'/>

    <Route name='login' path='login' handler={LoginContainer}/>
    <Route name='signup' path='signup' handler={SignupContainer}/>

    <Route name='home' path='home' handler={HomeContainer}>
      <DefaultRoute name='homeEmpty'/>
      <Route name='user' path=':userName' handler={UserContainer}>
        <DefaultRoute name='userHome'/>
        <Route name='planet' path=':planetName' handler={PlanetContainer}>
          <DefaultRoute name='planetHome'/>
          <Route name='codes' path='codes/:localId'/>
          <Route name='notes' path='notes/:localId'/>
        </Route>
      </Route>
    </Route>
  </Route>
)

ReactRouter.run(routes, ReactRouter.HashLocation, function (Root) {
  React.render(<Root/>, document.getElementById('content'))
})
