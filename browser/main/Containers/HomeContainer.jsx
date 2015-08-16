/* global localStorage */

var React = require('react/addons')
var ReactRouter = require('react-router')
var RouteHandler = ReactRouter.RouteHandler
var State = ReactRouter.State
var Navigation = ReactRouter.Navigation

var AuthFilter = require('../Mixins/AuthFilter')

var HomeNavigator = require('../Components/HomeNavigator')

module.exports = React.createClass({
  mixins: [AuthFilter.OnlyUser, State, Navigation],
  componentDidMount: function () {
    if (this.isActive('homeEmpty')) {
      var user = JSON.parse(localStorage.getItem('currentUser'))
      this.transitionTo('userHome', {userName: user.name})
    }
  },
  render: function () {
    return (
      <div className='HomeContainer'>
        <HomeNavigator/>
        <RouteHandler/>
      </div>
    )
  }
})
