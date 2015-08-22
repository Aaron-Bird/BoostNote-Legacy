/* global localStorage */

var React = require('react/addons')
var ReactRouter = require('react-router')
var RouteHandler = ReactRouter.RouteHandler
var State = ReactRouter.State
var Navigation = ReactRouter.Navigation

var AuthFilter = require('../Mixins/AuthFilter')
var KeyCaster = require('../Mixins/KeyCaster')

var HomeNavigator = require('../Components/HomeNavigator')

module.exports = React.createClass({
  mixins: [AuthFilter.OnlyUser, State, Navigation, KeyCaster('homeContainer')],
  componentDidMount: function () {
    if (this.isActive('homeEmpty')) {
      var user = JSON.parse(localStorage.getItem('currentUser'))
      if (user.Planets != null && user.Planets.length > 0) {
        this.transitionTo('planet', {userName: user.name, planetName: user.Planets[0].name})
        return
      }
      this.transitionTo('userHome', {userName: user.name})
    }
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'switchPlanet':
        this.refs.navigator.switchPlanetByIndex(e.data)
        break
    }
  },
  render: function () {
    return (
      <div className='HomeContainer'>
        <HomeNavigator ref='navigator'/>
        <RouteHandler/>
      </div>
    )
  }
})
