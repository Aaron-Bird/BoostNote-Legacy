require('../styles/main/index.styl')
require('react-select/dist/default.css')

var React = require('react/addons')

var ReactRouter = require('react-router')
var Route = ReactRouter.Route
var DefaultRoute = ReactRouter.DefaultRoute

var MainContainer = require('./Containers/MainContainer.jsx')

var LoginContainer = require('./Containers/LoginContainer.jsx')
var RegisterContainer = require('./Containers/RegisterContainer.jsx')

var UserContainer = require('./Containers/UserContainer.jsx')

var PlanetContainer = require('./Containers/PlanetContainer.jsx')

var routes = (
  <Route path='/' handler={MainContainer}>
    <Route name='login' path='login' handler={LoginContainer}/>
    <Route name='register' path='register' handler={RegisterContainer}/>

    <Route name='user' path=':userName' handler={UserContainer}>
      <DefaultRoute name='userHome'/>
      <Route name='planet' path=':planetName' handler={PlanetContainer}>
        <DefaultRoute name='planetHome'/>
        <Route name='snippets' path='snippets/:localId'/>
        <Route name='blueprints' path='blueprints/:localId'/>
      </Route>
    </Route>
  </Route>
)

ReactRouter.run(routes, ReactRouter.HashLocation, function (Root) {
  React.render(<Root/>, document.getElementById('content'))
})
