var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link
var RouteHandler = ReactRouter.RouteHandler

// Dummy
var currentUser = {
  name: 'testcat',
  email: 'testcat@example.com',
  profileName: 'Test Cat'
}

var userPlanets = [
  {
    id: 1,
    name: 'testcat',
    profileName: 'TestCat'
  },
  {
    id: 2,
    name: 'group1',
    profileName: 'Some Group#1'
  },
  {
    id: 3,
    name: 'group2',
    profileName: 'Some Group#1'
  }
]

var UserNavigator = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.object,
    currentUser: React.PropTypes.object
  },
  render: function () {
    var planets = userPlanets.map(function (planet, index) {
      return (
        <li key={planet.id} className={this.props.currentPlanet != null && this.props.currentPlanet.name === planet.name ? 'active' : ''}>
          <a href>{planet.profileName[0]}</a>
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
  render: function () {
    var currentPlanetName = this.props.params.planetName
    var currentPlanet = null
    userPlanets.some(function (planet) {
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
