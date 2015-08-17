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
      } else if (user.userType === 'team') {
        return this.renderTeamHome()
      } else {
        return this.renderUserHome()
      }
    } else {
      return (
        <div className='UserContainer'>
          <RouteHandler/>
        </div>
      )
    }
  },
  renderTeamHome: function () {
    var user = this.state.user

    var userPlanets = user.Planets.map(function (planet) {
      return (
        <li key={'planet-' + planet.id}>
          <Link to='planet' params={{userName: planet.userName, planetName: planet.name}}>{planet.userName}/{planet.name}</Link>
        </li>
      )
    })

    var members = user.Members == null ? [] : user.Members.map(function (member) {
      return (
        <li key={'user-' + member.id}>
          <Link to='userHome' params={{userName: member.name}}>{member.profileName} ({member.name})</Link>
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
        <div className='memberList'>
          <div className='memberLabel'>{members.length} {members.length > 0 ? 'Members' : 'Member'}</div>
          <ul className='members'>
            {members}
          </ul>
        </div>
        <div className='planetList'>
          <div className='planetLabel'>{userPlanets.length} {userPlanets.length > 0 ? 'Planets' : 'Planet'}</div>
          <div className='planetGroup'>
            <ul className='planets'>
              {userPlanets}
            </ul>
          </div>
        </div>
      </div>
    )
  },
  renderUserHome: function () {
    var user = this.state.user

    var userPlanets = user.Planets.map(function (planet) {
      return (
        <li key={'planet-' + planet.id}>
          <Link to='planet' params={{userName: planet.userName, planetName: planet.name}}>{planet.userName}/{planet.name}</Link>
          &nbsp;{!planet.public ? (<i className='fa fa-lock'/>) : null}
        </li>
      )
    })

    var teams = user.Teams == null ? [] : user.Teams.map(function (team) {
      return (
        <li key={'user-' + team.id}>
          <Link to='userHome' params={{userName: team.name}}>{team.profileName} ({team.name})</Link>
        </li>
      )
    })

    var teamPlanets = user.Teams == null ? [] : user.Teams.map(function (team) {
      var planets = team.Planets.map(function (planet) {
        return (
          <li key={'planet-' + planet.id}>
            <Link to='planet' params={{userName: planet.userName, planetName: planet.name}}>{planet.userName}/{planet.name}</Link>
            &nbsp;{!planet.public ? (<i className='fa fa-lock'/>) : null}
          </li>
        )
      })
      return (
      <div key={'user-' + team.id} className='planetGroup'>
        <div className='planetGroupLabel'>{team.name}</div>
        <ul className='planets'>
          {planets}
        </ul>
      </div>
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
          {teamPlanets}
        </div>
      </div>
    )
  }
})
