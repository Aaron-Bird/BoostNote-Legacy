var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link

var ModalBase = require('./ModalBase')
var PersonalSettingModal = require('./PersonalSettingModal')
var PlanetCreateModal = require('./PlanetCreateModal')

var AuthStore = require('../Stores/AuthStore')

module.exports = React.createClass({
  mixins: [ReactRouter.Navigation],
  propTypes: {
    currentPlanet: React.PropTypes.object,
    currentUser: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      isPlanetCreateModalOpen: false
    }
  },
  componentDidMount: function () {
    this.unsubscribe = AuthStore.listen(this.onLogout)
    document.addEventListener('keydown', this.handleKeyDown)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
    document.removeEventListener('keydown', this.handleKeyDown)
  },
  onLogout: function () {
    this.transitionTo('login')
  },
  openPersonalSettingModal: function () {
    this.setState({isPersonalSettingModalOpen: true})
  },
  closePersonalSettingModal: function () {
    this.setState({isPersonalSettingModalOpen: false})
  },
  openPlanetCreateModal: function () {
    this.setState({isPlanetCreateModalOpen: true})
  },
  closePlanetCreateModal: function () {
    this.setState({isPlanetCreateModalOpen: false})
  },
  handleKeyDown: function (e) {
    if (e.metaKey && e.keyCode > 48 && e.keyCode < 58) {
      var planet = this.props.currentUser.Planets[e.keyCode - 49]
      if (planet != null) {
        this.transitionTo('planet', {userName: planet.userName, planetName: planet.name})
      }
      e.preventDefault()
    }
  },
  render: function () {
    var planets = this.props.currentUser.Planets.map(function (planet, index) {
      return (
        <li key={planet.id} className={this.props.currentPlanet != null && this.props.currentPlanet.name === planet.name ? 'active' : ''}>
          <Link to='planet' params={{userName: planet.userName, planetName: planet.name}}>
            {planet.name[0]}
            <div className='planetTooltip'>{planet.userName}/{planet.name}</div>
          </Link>
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
      <div tabIndex='2' className='UserNavigator'>
        <button onClick={this.openPersonalSettingModal} className='userButton'>
          <img width='50' height='50' src='../vendor/dummy.jpg'/>
        </button>
        <ul className='planetList'>
          {planets}
        </ul>
        <button onClick={this.openPlanetCreateModal} className='newPlanet'><i className='fa fa-plus'/></button>

        <ModalBase isOpen={this.state.isPersonalSettingModalOpen} close={this.closePersonalSettingModal}>
          <PersonalSettingModal currentUser={this.props.currentUser} close={this.closePersonalSettingModal}/>
        </ModalBase>

        <ModalBase isOpen={this.state.isPlanetCreateModalOpen} close={this.closePlanetCreateModal}>
          <PlanetCreateModal close={this.closePlanetCreateModal}/>
        </ModalBase>
      </div>
    )
  }
})
