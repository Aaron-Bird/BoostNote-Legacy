/* global localStorage */
var React = require('react/addons')
var ReactRouter = require('react-router')
var RouteHandler = ReactRouter.RouteHandler
var Link = ReactRouter.Link
var request = require('superagent')

var UserNavigator = require('../Components/UserNavigator')

var AuthStore = require('../Stores/AuthStore')
var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin, ReactRouter.Navigation, ReactRouter.State],
  propTypes: {
    params: React.PropTypes.shape({
      userName: React.PropTypes.string,
      planetName: React.PropTypes.string
    })
  },
  getInitialState: function () {
    return {
      currentUser: AuthStore.getUser(),
      isUserFetched: false,
      user: null
    }
  },
  componentDidMount: function () {
    this.unsubscribePlanet = PlanetStore.listen(this.onListen)
    this.unsubscribeAuth = AuthStore.listen(this.onListen)

    if (this.isActive('userHome')) {
      this.fetchUser(this.props.params.userName)
    }
  },
  componentWillUnmount: function () {
    this.unsubscribePlanet()
    this.unsubscribeAuth()
  },
  componentDidUpdate: function () {
    if (this.isActive('userHome') && (this.state.user == null || this.state.user.name !== this.props.params.userName)) {
      this.fetchUser(this.props.params.userName)
    }
  },
  fetchUser: function (userName) {
    request
      .get('http://localhost:8000/' + userName)
      .send()
      .end(function (err, res) {
        if (err) {
          console.error(err)
          return
        }

        this.setState({user: res.body, isUserFetched: true})
      }.bind(this))
  },
  onListen: function (res) {
    if (res == null || res.status == null) return

    var currentUser = this.state.currentUser

    if (res.status === 'planetCreated') {
      currentUser.Planets.push(res.data)

      localStorage.setItem('user', JSON.stringify(currentUser))
      this.setState({currentUser: currentUser})
      return
    }

    if (res.status === 'planetDeleted') {
      currentUser.Planets.some(function (_planet, index) {
        if (res.data.id === _planet.id) {
          currentUser.Planets.splice(index, 1)
          return true
        }
        return false
      })

      localStorage.setItem('user', JSON.stringify(currentUser))
      this.setState({currentUser: currentUser})
      return
    }

    if (res.status === 'nameChanged') {
      this.setState({currentUser: AuthStore.getUser()})
      return
    }

    if (res.status === 'userProfileUpdated') {
      this.setState({currentUser: AuthStore.getUser()})
      return
    }
  },
  render: function () {
    var currentPlanetName = this.props.params.planetName
    var currentUser = this.state.currentUser
    var user = this.state.user

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

    var content
    if (this.isActive('userHome')) {
      if (this.state.isUserFetched === false) {
        content = (
          <div className='UserHome'>
            User Loading...
          </div>
        )
      } else {
        var planets = user.Planets.map(function (planet) {
          return (
            <li key={'planet-' + planet.id}>
              <Link to='planet' params={{userName: planet.userName, planetName: planet.name}}>{planet.userName}/{planet.name}</Link>
            </li>
          )
        })
        content = (
          <div className='UserHome'>
            <h1>User Profile</h1>
            <div className='userProfile'>
              <img className='userPhoto' width='150' height='150' src='../vendor/dummy.jpg'/>
              <div className='userIntro'>
                <div className='userProfileName'>{user.profileName}</div>
                <Link className='userName' to='user' params={{userName: user.name}}>{user.name}</Link>
              </div>
            </div>
            <h2>Planets</h2>
            <ul className='userPlanetList'>
              {planets}
            </ul>
          </div>
        )
      }
    } else {
      content = (
        <RouteHandler/>
      )
    }

    return (
      <div className='UserContainer'>
        <UserNavigator currentPlanet={currentPlanet} currentUser={currentUser}/>
        {content}
      </div>
    )
  }
})
