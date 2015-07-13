var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link
var RouteHandler = ReactRouter.RouteHandler

var AuthStore = require('../Stores/AuthStore')

var UserNavigator = React.createClass({
  mixins: [ReactRouter.Navigation],
  propTypes: {
    currentPlanet: React.PropTypes.object,
    currentUser: React.PropTypes.object
  },
  componentDidMount: function () {
    this.unsubscribe = AuthStore.listen(this.onLogout)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  onLogout: function () {
    this.transitionTo('login')
  },
  render: function () {
    var planets = this.props.currentUser.Planets.map(function (planet, index) {
      return (
        <li key={planet.id} className={this.props.currentPlanet != null && this.props.currentPlanet.name === planet.name ? 'active' : ''}>
          <Link to='planet' params={{userName: this.props.currentUser.name, planetName: planet.name}} href>{planet.name[0]}</Link>
          <div className='shortCut'>⌘{index + 1}</div>
        </li>
      )
    }.bind(this))
    if (this.props.currentUser == null) {
      return (
        <div className='UserNavigator'>
        </div>
      )
    }

    return (
      <div className='UserNavigator'>
        <Link to='userHome' params={{userName: this.props.currentUser.name}} className='userConfig'>
          <img width='50' height='50' src='../vendor/dummy.jpg'/>
        </Link>
        <ul>
          {planets}
        </ul>
        <button className='newPlanet'><i className='fa fa-plus'/></button>
      </div>
    )
  }
})

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ReactRouter.Navigation],
  propTypes: {
    params: React.PropTypes.shape({
      planetName: React.PropTypes.string
    })
  },
  render: function () {
    var currentPlanetName = this.props.params.planetName
    var currentUser = AuthStore.getUser()

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
