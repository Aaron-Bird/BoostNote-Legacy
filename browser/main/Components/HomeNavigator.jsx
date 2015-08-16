/* global localStorage */

var React = require('react/addons')
var ReactRouter = require('react-router')
var Navigation = ReactRouter.Navigation
var State = ReactRouter.State
var Link = ReactRouter.Link
var Reflux = require('reflux')

var Modal = require('../Mixins/Modal')

var UserStore = require('../Stores/UserStore')

var PreferencesModal = require('./PreferencesModal')
var PlanetCreateModal = require('./PlanetCreateModal')
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
        if (this.state.currentUser.id === res.data.id) {
          this.setState({currentUser: res.data})
        }
        break
    }
  },
  openPreferencesModal: function () {
    this.openModal(PreferencesModal)
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
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
    this.transitionTo('login')
  },
  render: function () {
    var params = this.getParams()

    if (this.state.currentUser == null) {
      return (
        <div className='HomeNavigator'>
        </div>
      )
    }

    var planets = ((this.state.currentUser == null || this.state.currentUser.Planets == null) ? [] : this.state.currentUser.Planets).map(function (planet, index) {
      return (
        <li key={planet.id} className={params.userName === planet.userName && params.planetName === planet.name ? 'active' : ''}>
          <Link to='planet' params={{userName: planet.userName, planetName: planet.name}}>
            {planet.name[0]}
            <div className='planetTooltip'>{planet.userName}/{planet.name}</div>
          </Link>
          <div className='shortCut'>⌘{index + 1}</div>
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
        <ul className='planetList'>
          {planets}
        </ul>
        <button onClick={this.openPlanetCreateModal} className='newPlanet'><i className='fa fa-plus'/></button>
      </div>
    )
  },
  renderPopup: function () {
    return (
      <div ref='profilePopup' className={'profilePopup' + (this.state.isProfilePopupOpen ? '' : ' close')}>
        <div className='profileGroup'>
          <div className='profileGroupLabel'>
            <span>You</span>
          </div>
          <ul className='profileGroupList'>
            <li>
              <Link to='userHome' params={{userName: this.state.currentUser.name}} className='userName'>Profile</Link>
              <div className='userSetting'><i className='fa fa-gear'/></div>
            </li>
          </ul>
        </div>

        <div className='profileGroup'>
          <div className='profileGroupLabel'>
            <span>Team</span>
          </div>
          <ul className='profileGroupList'>
            <li>
              <div className='userName'>A team</div>
              <div className='userSetting'><i className='fa fa-gear'/></div>
            </li>
            <li>
              <div className='userName'>B team</div>
              <div className='userSetting'><i className='fa fa-gear'/></div>
            </li>
            <li>
              <div className='userName'>C team</div>
              <div className='userSetting'><i className='fa fa-gear'/></div>
            </li>
            <li>
              <button className='createNewTeam'><i className='fa fa-plus-square-o'/> create new team</button>
            </li>
          </ul>
        </div>

        <ul className='controlGroup'>
          <li>
            <button onClick={this.openPreferencesModal}><i className='fa fa-gear fa-fw'/> Preferences</button>
          </li>
          <li>
            <button onClick={this.handleLogoutClick}><i className='fa fa-sign-out fa-fw'/> Logout</button>
          </li>
        </ul>
      </div>
    )
  }
})
