/* global localStorage */

var React = require('react/addons')
var ReactRouter = require('react-router')
var RouteHandler = ReactRouter.RouteHandler
var Link = ReactRouter.Link
var Reflux = require('reflux')

var LinkedState = require('../Mixins/LinkedState')
var Modal = require('../Mixins/Modal')

var Hq = require('../Services/Hq')

var ProfileImage = require('../Components/ProfileImage')
var EditProfileModal = require('../Components/EditProfileModal')

var UserStore = require('../Stores/UserStore')
var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [LinkedState, ReactRouter.State, Modal, Reflux.listenTo(UserStore, 'onUserChange')],
  propTypes: {
    params: React.PropTypes.shape({
      userName: React.PropTypes.string,
      planetName: React.PropTypes.string
    })
  },
  getInitialState: function () {
    return {
      user: null
    }
  },
  componentDidMount: function () {
    this.fetchUser()
  },
  componentWillReceiveProps: function (nextProps) {
    if (this.state.user == null) {
      this.fetchUser(nextProps.params.userName)
      return
    }

    if (nextProps.params.userName !== this.state.user.name) {
      this.setState({
        user: null
      }, function () {
        this.fetchUser(nextProps.params.userName)
      })
    }
  },
  onUserChange: function (res) {
    if (this.state.user == null) return

    switch (res.status) {
      case 'userUpdated':
        if (this.state.user.id === res.data.id) {
          this.setState({user: res.data})
        }
        break
    }
  },
  fetchUser: function (userName) {
    if (userName == null) userName = this.props.params.userName

    Hq.fetchUser(userName)
      .then(function (res) {
        this.setState({user: res.body})
      }.bind(this))
      .catch(function (err) {
        console.error(err)
      })
  },
  onListen: function (res) {
    console.log('on Listen')
    if (res == null || res.status == null) return

    var currentUser = this.state.currentUser

    if (res.status === 'planetCreated') {
      currentUser.Planets.push(res.data)

      localStorage.setItem('currentUser', JSON.stringify(currentUser))
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

      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      this.setState({currentUser: currentUser})
      return
    }
  },
  openEditProfileModal: function () {
    this.openModal(EditProfileModal, {targetUser: this.state.user})
  },
  render: function () {
    var user = this.state.user

    if (this.isActive('userHome')) {
      if (user == null) {
        return (
          <div className='UserContainer'>
            User Loading...
          </div>
        )
      } else {
        var userPlanets = user.Planets.map(function (planet) {
          return (
            <li key={'planet-' + planet.id}>
              <Link to='planet' params={{userName: planet.userName, planetName: planet.name}}>{planet.userName}/{planet.name}</Link>
            </li>
          )
        })

        var teams = user.Teams == null ? [] : user.Teams.map(function (team) {
          return (
            <li>
              Some team
            </li>
          )
        })
        return (
          <div className='UserContainer'>
            <div className='userProfile'>
              <ProfileImage className='userPhoto' size='75' email={user.email}/>
              <div className='userInfo'>
                <div className='userProfileName'>{user.profileName}</div>
                <div className='userName'>{user.name}</div>
              </div>

              <button onClick={this.openEditProfileModal} className='editProfileButton'>Edit profile</button>
            </div>
            <div className='teamList'>
              <div className='teamLabel'>{teams.length} {teams.length > 0 ? 'Teams' : 'Team'}</div>
              <ul className='teams'>
                {teams}
              </ul>
            </div>
            <div className='planetList'>
              <div className='planetLabel'>{userPlanets.length} {userPlanets.length > 0 ? 'Planets' : 'Planet'}</div>
              <div className='planetGroup'>
                <div className='planetGroupLabel'>{user.profileName}</div>
                <ul className='planets'>
                  {userPlanets}
                </ul>
              </div>
            </div>
          </div>
        )
      }
    } else {
      return (
        <div className='UserContainer'>
          <RouteHandler/>
        </div>
      )
    }
  }
})
