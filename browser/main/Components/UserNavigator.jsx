var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link

var ModalBase = require('./ModalBase')
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
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  onLogout: function () {
    this.transitionTo('login')
  },
  openPlanetCreateModal: function () {
    this.setState({isPlanetCreateModalOpen: true})
  },
  closePlanetCreateModal: function () {
    this.setState({isPlanetCreateModalOpen: false})
  },
  render: function () {
    var planets = this.props.currentUser.Planets.map(function (planet, index) {
      return (
        <li key={planet.id} className={this.props.currentPlanet != null && this.props.currentPlanet.name === planet.name ? 'active' : ''}>
          <Link to='planet' params={{userName: planet.userName, planetName: planet.name}} href>{planet.name[0]}</Link>
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
        <Link to='userHome' params={{userName: this.props.currentUser.name}} className='userConfig'>
          <img width='50' height='50' src='../vendor/dummy.jpg'/>
        </Link>
        <ul>
          {planets}
        </ul>
        <button onClick={this.openPlanetCreateModal} className='newPlanet'><i className='fa fa-plus'/></button>
        <ModalBase isOpen={this.state.isPlanetCreateModalOpen} close={this.closePlanetCreateModal}>
          <PlanetCreateModal close={this.closePlanetCreateModal}/>
        </ModalBase>
      </div>
    )
  }
})
