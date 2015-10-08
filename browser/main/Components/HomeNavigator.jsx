var React = require('react')
var ReactRouter = require('react-router')
var Navigation = ReactRouter.Navigation
var State = ReactRouter.State
var Link = ReactRouter.Link
var Reflux = require('reflux')
var _ = require('lodash')

var Modal = require('../Mixins/Modal')

var UserStore = require('../Stores/UserStore')

var PreferencesModal = require('./PreferencesModal')
var PlanetCreateModal = require('./PlanetCreateModal')
var TeamCreateModal = require('./TeamCreateModal')
var LogoutModal = require('./LogoutModal')
var ProfileImage = require('./ProfileImage')

module.exports = React.createClass({
  mixins: [Navigation, State, Reflux.listenTo(UserStore, 'onUserChange'), Modal],
  getInitialState: function () {
    return {
      isPlanetCreateModalOpen: false,
      currentUser: JSON.parse(localStorage.getItem('currentUser'))
    }
  },
  onUserChange: function (res) {
    switch (res.status) {
      case 'userUpdated':
        var user = res.data
        var currentUser = this.state.currentUser
        if (currentUser.id === user.id) {
          this.setState({currentUser: user})
          return
        }

        if (user.userType === 'team') {
          var isMyTeam = user.Members.some(function (member) {
            if (currentUser.id === member.id) {
              return true
            }
            return false
          })

          if (isMyTeam) {
            var isNew = !currentUser.Teams.some(function (team, index) {
              if (user.id === team.id) {
                currentUser.Teams.splice(index, 1, user)
                return true
              }
              return false
            })

            if (isNew) {
              currentUser.Teams.push(user)
            }

            this.setState({currentUser: currentUser})
          }
        }
        break
    }
  },
  openTeamCreateModal: function () {
    this.openModal(TeamCreateModal, {user: this.state.currentUser, transitionTo: this.transitionTo})
  },
  handleLogoutClick: function () {
    this.openModal(LogoutModal, {transitionTo: this.transitionTo})
  },
  switchUserByIndex: function (index) {
    var userProp = this.refs.users.props.children[index - 1].props
    this.transitionTo('user', {userId: userProp.id})
  },
  render: function () {
    var params = this.getParams()

    if (this.state.currentUser == null) {
      return null
    }
    console.log(this.state.currentUser.Teams)

    var users = [this.state.currentUser]
    if (_.isArray(this.state.currentUser.Teams)) users = users.concat(this.state.currentUser.Teams)

    var userButtons = users.map(function (user, index) {
      return (
        <li key={'user-' + user.id}>
          <Link to='user' params={{userId: user.id}}>
            {user.userType === 'person' ? (<ProfileImage email={user.email} size='44'/>): user.name[0]}
            <div className='userTooltip'>{user.name}</div>
          </Link>
          {index < 9 ? (<div className='shortCut'>⌘{index + 1}</div>) : null}
        </li>
      )
    })

    return (
      <div className='HomeNavigator'>
        <ul ref='users' className='userList'>
          {userButtons}
        </ul>
        <button onClick={this.openTeamCreateModal} className='newTeamButton'>
          <i className='fa fa-plus'/>
          <div className='tooltip'>Create new team</div>
        </button>
      </div>
    )
  }
})
