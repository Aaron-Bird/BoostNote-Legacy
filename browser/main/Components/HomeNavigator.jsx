/* global localStorage */

var React = require('react/addons')
var ReactRouter = require('react-router')
var Navigation = ReactRouter.Navigation
var State = ReactRouter.State
var Link = ReactRouter.Link
var Reflux = require('reflux')

var Modal = require('../Mixins/Modal')

var UserStore = require('../Stores/UserStore')

var AboutModal = require('./AboutModal')
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
  openAboutModal: function () {
    this.openModal(AboutModal)
  },
  openPlanetCreateModal: function () {
    this.openModal(PlanetCreateModal, {transitionTo: this.transitionTo})
  },
  handleKeyDown: function (e) {
    if (this.state.currentUser == null) return
    if (e.metaKey && e.keyCode > 48 && e.keyCode < 58) {
      var planet = this.state.currentUser.Planets[e.keyCode - 49]
      if (planet != null) {
        this.transitionTo('planet', {userName: planet.userName, planetName: planet.name})
      }
      e.preventDefault()
    }
  },
  toggleProfilePopup: function () {
    this.openProfilePopup()
  },
  openProfilePopup: function () {
    this.setState({isProfilePopupOpen: true}, function () {
      document.addEventListener('click', this.closeProfilePopup)
    })
  },
  closeProfilePopup: function () {
    document.removeEventListener('click', this.closeProfilePopup)
    this.setState({isProfilePopupOpen: false})
  },
  handleLogoutClick: function () {
    this.openModal(LogoutModal, {transitionTo: this.transitionTo})
  },
  switchPlanetByIndex: function (index) {
    var planetProps = this.refs.planets.props.children[index - 1].props
    this.transitionTo('planet', {userName: planetProps.userName, planetName: planetProps.planetName})
  },
  render: function () {
    var params = this.getParams()

    if (this.state.currentUser == null) {
      return (
        <div className='HomeNavigator'>
        </div>
      )
    }

    var planets = (this.state.currentUser.Planets.concat(this.state.currentUser.Teams.reduce(function (planets, team) {
      return team.Planets == null ? planets : planets.concat(team.Planets)
    }, []))).map(function (planet, index) {
      return (
        <li userName={planet.userName} planetName={planet.name} key={planet.id} className={params.userName === planet.userName && params.planetName === planet.name ? 'active' : ''}>
          <Link to='planet' params={{userName: planet.userName, planetName: planet.name}}>
            {planet.name[0]}
            <div className='planetTooltip'>{planet.userName}/{planet.name}</div>
          </Link>
          {index < 9 ? (<div className='shortCut'>⌘{index + 1}</div>) : null}
        </li>
      )
    })

    var popup = this.renderPopup()

    return (
      <div className='HomeNavigator'>
        <button onClick={this.toggleProfilePopup} className='profileButton'>
          <ProfileImage size='55' email={this.state.currentUser.email}/>
        </button>
        {popup}
        <ul ref='planets' className='planetList'>
          {planets}
        </ul>
        <button onClick={this.openPlanetCreateModal} className='newPlanet'>
          <i className='fa fa-plus'/>
          <div className='tooltip'>Create new planet</div>
        </button>
      </div>
    )
  },
  renderPopup: function () {
    var teams = this.state.currentUser.Teams == null ? [] : this.state.currentUser.Teams.map(function (team) {
      return (
        <li key={'user-' + team.id}>
          <Link to='userHome' params={{userName: team.name}} className='userName'>{team.profileName} ({team.name})</Link>
        </li>
      )
    })

    return (
      <div ref='profilePopup' className={'profilePopup' + (this.state.isProfilePopupOpen ? '' : ' close')}>
        <div className='profileGroup'>
          <div className='profileGroupLabel'>
            <span>You</span>
          </div>
          <ul className='profileGroupList'>
            <li>
              <Link to='userHome' params={{userName: this.state.currentUser.name}} className='userName'>Profile ({this.state.currentUser.name})</Link>
            </li>
          </ul>
        </div>

        <div className='profileGroup'>
          <div className='profileGroupLabel'>
            <span>Team</span>
          </div>
          <ul className='profileGroupList'>
            {teams}
            <li>
              <button onClick={this.openTeamCreateModal} className='createNewTeam'><i className='fa fa-plus-square-o'/> create new team</button>
            </li>
          </ul>
        </div>

        <ul className='controlGroup'>
          <li>
            <button onClick={this.openAboutModal}><i className='fa fa-info-circle fa-fw'/> About this app</button>
          </li>
          <li>
            <button onClick={this.handleLogoutClick}><i className='fa fa-sign-out fa-fw'/> Log out</button>
          </li>
        </ul>
      </div>
    )
  }
})
