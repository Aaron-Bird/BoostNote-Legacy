/* global localStorage */
var React = require('react/addons')
var ReactRouter = require('react-router')
var RouteHandler = ReactRouter.RouteHandler

var UserNavigator = require('../Components/UserNavigator')

var AuthStore = require('../Stores/AuthStore')
var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ReactRouter.Navigation],
  propTypes: {
    params: React.PropTypes.shape({
      planetName: React.PropTypes.string
    })
  },
  getInitialState: function () {
    return {
      currentUser: AuthStore.getUser()
    }
  },
  componentDidMount: function () {
    this.unsubscribe = PlanetStore.listen(this.onListen)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  onListen: function (res) {
    if (res.status == null) return

    if (res.status === 'planetCreated') {
      var currentUser = this.state.currentUser
      currentUser.Planets.push(res.data)

      localStorage.setItem('user', JSON.stringify(currentUser))
      this.setState({currentUser: currentUser})
    }

    if (res.status === 'nameChanged') {
      this.setState({currentUser: AuthStore.getUser()})
    }
  },
  render: function () {
    var currentPlanetName = this.props.params.planetName
    var currentUser = this.state.currentUser

    // user must be logged in
    if (currentUser == null) return (<div></div>)

    var currentPlanet = null
    currentUser.Planets.some(function (planet) {
      if (planet.name === currentPlanetName) {
        currentPlanet = planet
        return true
      }
      return false
    })

    return (
      <div className='UserContainer'>
        <UserNavigator currentPlanet={currentPlanet} currentUser={currentUser}/>
        <RouteHandler/>
      </div>
    )
  }
})
