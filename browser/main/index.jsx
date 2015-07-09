require('../styles/main/index.styl')
require('react-select/dist/default.css')

var React = require('react/addons')

var ReactRouter = require('react-router')
var Route = ReactRouter.Route
var DefaultRoute = ReactRouter.DefaultRoute

var MainContainer = require('./Containers/MainContainer.jsx')

var LoginContainer = require('./Containers/LoginContainer.jsx')
var RegisterContainer = require('./Containers/RegisterContainer.jsx')

var PlanetContainer = require('./Containers/PlanetContainer.jsx')

var Dashboard = require('./Containers/DashboardContainer.jsx')
var SnippetContainer = require('./Containers/SnippetContainer.jsx')
var BlueprintContainer = require('./Containers/BlueprintContainer.jsx')

var routes = (
  <Route path='/' handler={MainContainer}>
    <Route name='planet' path=':userName/:planetName' handler={PlanetContainer}>
      <DefaultRoute name='dashboard' handler={Dashboard}/>
      <Route name='snippets' handler={SnippetContainer}/>
      <Route name='blueprint' handler={BlueprintContainer}/>
    </Route>
    <Route name='login' path='login' handler={LoginContainer}/>
    <Route name='register' path='register' handler={RegisterContainer}/>
  </Route>
)

ReactRouter.run(routes, ReactRouter.HashLocation, function (Root) {
  React.render(<Root/>, document.getElementById('content'))
})
