/* global localStorage */

var React = require('react/addons')
var ReactRouter = require('react-router')
var Navigation = ReactRouter.Navigation
var State = ReactRouter.State
var RouteHandler = ReactRouter.RouteHandler
var Link = ReactRouter.Link
var Reflux = require('reflux')

var LinkedState = require('../Mixins/LinkedState')
var Modal = require('../Mixins/Modal')
var Helper = require('../Mixins/Helper')

var Hq = require('../Services/Hq')

var ProfileImage = require('../Components/ProfileImage')
var EditProfileModal = require('../Components/EditProfileModal')
var TeamSettingsModal = require('../Components/TeamSettingsModal')
var PlanetCreateModal = require('../Components/PlanetCreateModal')
var AddMemberModal = require('../Components/AddMemberModal')
var TeamCreateModal = require('../Components/TeamCreateModal')

var UserStore = require('../Stores/UserStore')
var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [LinkedState, State, Navigation, Modal, Reflux.listenTo(UserStore, 'onUserChange'), Reflux.listenTo(PlanetStore, 'onPlanetChange'), Helper],
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

    var member
    switch (res.status) {
      case 'userUpdated':
        if (this.state.user.id === res.data.id) {
          this.setState({user: res.data})
        }
        break
      case 'memberAdded':
        member = res.data
        if (this.state.user.userType === 'team' && member.TeamMember.TeamId === this.state.user.id) {
          this.state.user.Members = this.updateItemToTargetArray(member, this.state.user.Members)

          this.setState({user: this.state.user})
        }
        break
      case 'memberRemoved':
        member = res.data
        if (this.state.user.userType === 'team' && member.TeamMember.TeamId === this.state.user.id) {
          this.state.user.Members = this.deleteItemFromTargetArray(member, this.state.user.Members)

          this.setState({user: this.state.user})
        }
        break
    }
  },
  onPlanetChange: function (res) {
    if (this.state.user == null) return

    var currentUser, planet, isOwner, team
    switch (res.status) {
      case 'updated':
        // if state.user is currentUser, planet will be fetched by UserStore
        currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (currentUser.id === this.state.user.id) return

        planet = res.data
        isOwner = planet.Owner.id === this.state.user.id
        if (isOwner) {
          this.state.user.Planets = this.updateItemToTargetArray(planet, this.state.user.Planets)
          this.setState({user: this.state.user})
          return
        }
        // check if team of user has this planet
        team = null
        this.state.user.userType !== 'team' && this.state.user.Teams.some(function (_team) {
          if (planet.Owner.id === _team.id) {
            team = _team
            return true
          }
          return false
        })
        if (team != null) {
          team.Planets = this.updateItemToTargetArray(planet, team.Planets)
          this.setState({user: this.state.user})
          return
        }

        break
      case 'destroyed':
        // if state.user is currentUser, planet will be fetched by UserStore
        currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (currentUser.id === this.state.user.id) return

        planet = res.data
        isOwner = planet.Owner.id === this.state.user.id
        if (isOwner) {
          this.state.user.Planets = this.deleteItemFromTargetArray(planet, this.state.user.Planets)
          this.setState({user: this.state.user})
          return
        }
        // check if team of user has this planet
        team = null
        this.state.user.userType !== 'team' && this.state.user.Teams.some(function (_team) {
          if (planet.Owner.id === _team.id) {
            team = _team
            return true
          }
          return false
        })
        if (team != null) {
          team.Planets = this.deleteItemFromTargetArray(planet, team.Planets)
          this.setState({user: this.state.user})
          return
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
    this.openModal(EditProfileModal, {user: this.state.user})
  },
  openTeamSettingsModal: function () {
    this.openModal(TeamSettingsModal, {team: this.state.user})
  },
  openAddUserModal: function () {
    this.openModal(AddMemberModal, {team: this.state.user})
  },
  openTeamCreateModal: function () {
    this.openModal(TeamCreateModal, {user: this.state.user})
  },
  openPlanetCreateModalWithOwnerName: function (name) {
    return function () {
      this.openModal(PlanetCreateModal, {ownerName: name})
    }.bind(this)
  },
  render: function () {
    var user = this.state.user

    var currentUser = JSON.parse(localStorage.getItem('currentUser'))

    if (this.isActive('userHome')) {
      if (user == null) {
        return (
          <div className='UserContainer'>
            User Loading...
          </div>
        )
      } else if (user.userType === 'team') {
        return this.renderTeamHome(currentUser)
      } else {
        return this.renderUserHome(currentUser)
      }
    } else if (this.isActive('planet') && user != null && user.userType === 'team') {
      var members = user.Members.map(function (member) {
        return (
          <li key={'user-' + member.id}><Link to='userHome' params={{userName: member.name}}>
            <ProfileImage className='memberImage' size='22' email={member.email}/>
            <div className='memberInfo'>
              <div className='memberProfileName'>{member.profileName}</div>
              <div className='memberName'>@{member.name}</div>
            </div>
          </Link></li>
        )
      })
      return (
        <div className='UserContainer'>
          <RouteHandler/>
          <div className='memberPopup'>
            <div className='label'>Members</div>
            <ul className='members'>
              {members}
            </ul>
          </div>
        </div>
      )
    } else {
      return (
        <div className='UserContainer'>
          <RouteHandler/>
        </div>
      )
    }
  },
  renderTeamHome: function (currentUser) {
    var user = this.state.user

    var isOwner = user.Members == null ? false : user.Members.some(function (member) {
      return member.id === currentUser.id && member.TeamMember.role === 'owner'
    })

    var userPlanets = user.Planets.map(function (planet) {
      return (
        <li key={'planet-' + planet.id}>
          <Link to='planet' params={{userName: user.name, planetName: planet.name}}>{user.name}/{planet.name}</Link>
          &nbsp;{!planet.public ? (<i className='fa fa-lock'/>) : null}
        </li>
      )
    })

    var members = user.Members == null ? [] : user.Members.map(function (member) {
      return (
        <li key={'user-' + member.id}>
          <Link to='userHome' params={{userName: member.name}}>
            <ProfileImage size='22' className='memberImage' email={member.email}/>
            <div className='memberInfo'>
              <div className='memberProfileName'>{member.profileName} <span className='memberRole'>({member.TeamMember.role})</span></div>
              <div className='memberName'>@{member.name}</div>
            </div>
          </Link>
          <div className='role'></div>
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

          {isOwner ? (<button onClick={this.openTeamSettingsModal} className='editProfileButton'>Team settings</button>) : null}
        </div>
        <div className='memberList'>
          <div className='memberLabel'>{members.length} {members.length > 1 ? 'Members' : 'Member'}</div>
          <ul className='members'>
            {members}
            {isOwner ? (<li><button onClick={this.openAddUserModal} className='addMemberButton'><i className='fa fa-plus-square-o'/> add Member</button></li>) : null}
          </ul>
        </div>
        <div className='planetList'>
          <div className='planetLabel'>{userPlanets.length} {userPlanets.length > 0 ? 'Planets' : 'Planet'}</div>
          <div className='planetGroup'>
            <ul className='planets'>
              {userPlanets}
              {isOwner ? (<li><button onClick={this.openPlanetCreateModalWithOwnerName(user.name)} className='createPlanetButton'><i className='fa fa-plus-square-o'/> Create new planet</button></li>) : null}
            </ul>
          </div>
        </div>
      </div>
    )
  },
  renderUserHome: function (currentUser) {
    var user = this.state.user

    var isOwner = currentUser.id === user.id

    var userPlanets = user.Planets.map(function (planet) {
      return (
        <li key={'planet-' + planet.id}>
          <Link to='planet' params={{userName: user.name, planetName: planet.name}}>{user.name}/{planet.name}</Link>
          &nbsp;{!planet.public ? (<i className='fa fa-lock'/>) : null}
        </li>
      )
    })

    var teams = user.Teams == null ? [] : user.Teams.map(function (team) {
      return (
        <li key={'user-' + team.id}>
          <Link to='userHome' params={{userName: team.name}}>
            <div className='teamInfo'>
              <div className='teamProfileName'>{team.profileName}</div>
              <div className='teamName'>@{team.name}</div>
            </div>
          </Link>
        </li>
      )
    })

    var teamPlanets = user.Teams == null ? [] : user.Teams.map(function (team) {
      var planets = (team.Planets == null ? [] : team.Planets).map(function (planet) {
        return (
          <li key={'planet-' + planet.id}>
            <Link to='planet' params={{userName: team.name, planetName: planet.name}}>{team.name}/{planet.name}</Link>
            &nbsp;{!planet.public ? (<i className='fa fa-lock'/>) : null}
          </li>
        )
      })
      return (
      <div key={'user-' + team.id} className='planetGroup'>
        <div className='planetGroupLabel'>{team.profileName} <small>@{team.name}</small></div>
        <ul className='planets'>
          {planets}
          {isOwner ? (<li><button onClick={this.openPlanetCreateModalWithOwnerName(team.name)} className='createPlanetButton'><i className='fa fa-plus-square-o'/> Create new planet</button></li>) : null}
        </ul>
      </div>
      )
    }.bind(this))

    var planetCount = userPlanets.length + user.Teams.reduce(function (sum, team) {
        return sum + (team.Planets != null ? team.Planets.length : 0)
      }, 0)

    return (
      <div className='UserContainer'>
        <div className='userProfile'>
          <ProfileImage className='userPhoto' size='75' email={user.email}/>
          <div className='userInfo'>
            <div className='userProfileName'>{user.profileName}</div>
            <div className='userName'>{user.name}</div>
          </div>

          {isOwner ? (
          <button onClick={this.openEditProfileModal} className='editProfileButton'>Edit profile</button>) : null}
        </div>
        <div className='teamList'>
          <div className='teamLabel'>{teams.length} {teams.length > 1 ? 'Teams' : 'Team'}</div>
          <ul className='teams'>
            {teams}
            {isOwner ? (<li><button onClick={this.openTeamCreateModal} className='createTeamButton'><i className='fa fa-plus-square-o'/> Create new team</button></li>) : null}
          </ul>
        </div>
        <div className='planetList'>
          <div className='planetLabel'>{planetCount} {planetCount > 1 ? 'Planets' : 'Planet'}</div>
          <div className='planetGroup'>
            <div className='planetGroupLabel'>{user.profileName} <small>@{user.name}</small></div>
            <ul className='planets'>
              {userPlanets}
              {isOwner ? (<li><button onClick={this.openPlanetCreateModalWithOwnerName(user.name)} className='createPlanetButton'><i className='fa fa-plus-square-o'/> Create new planet</button></li>) : null}
            </ul>
          </div>
          {teamPlanets}
        </div>
      </div>
    )
  }
})
