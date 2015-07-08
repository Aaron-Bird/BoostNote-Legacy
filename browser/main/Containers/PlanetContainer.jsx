var React = require('react/addons')
var RouteHandler = require('react-router').RouteHandler
var ReactRouter = require('react-router')
var Link = ReactRouter.Link
var ModalBase = require('../Components/ModalBase')
var LaunchModal = require('../Components/LaunchModal')

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

var PlanetNavigator = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.object
  },
  render: function () {
    var planets = userPlanets.map(function (planet) {
      return (
        <li key={planet.id} className={this.props.currentPlanet.name === planet.name ? 'active' : ''}><a>{planet.profileName[0]}</a></li>
      )
    }.bind(this))

    return (
      <div className='PlanetNavigator'>
        <ul>
          {planets}
        </ul>
      </div>
    )
  }
})

var PlanetMain = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.object
  },
  render: function () {
    return (
      <div className='PlanetMain'>
        <SideNavigator currentPlanet={this.props.currentPlanet}/>
        <Screen currentPlanet={this.props.currentPlanet}/>
      </div>
    )
  }
})

var SideNavigator = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.shape({
      name: React.PropTypes.string
    })
  },
  getInitialState: function () {
    return {
      isLaunchModalOpen: false
    }
  },
  openLaunchModal: function () {
    console.log('and...OPEN!!')
    this.setState({isLaunchModalOpen: true})
  },
  closeLaunchModal: function () {
    this.setState({isLaunchModalOpen: false})
  },
  submitLaunchModal: function (ret) {
    console.log(ret)
    this.setState({isLaunchModalOpen: false})
  },
  render: function () {
    var currentPlanetName = this.props.currentPlanet.name

    return (
      <div className='SideNavigator'>
        <div className='nav-header'>
          <p className='planet-name'>{currentPlanetName}</p>
          <button className='menu-btn'>
            <i className='fa fa-chevron-down'></i>
          </button>
        </div>
        <button onClick={this.openLaunchModal} className='btn-primary btn-block'>
          <i className='fa fa-rocket fa-fw'/> Launch
        </button>
        <ModalBase isOpen={this.state.isLaunchModalOpen} close={this.closeLaunchModal}>
          <LaunchModal submit={this.submitLaunchModal} close={this.closeLaunchModal}/>
        </ModalBase>
        <nav>
          <Link to='dashboard' params={{planetName: currentPlanetName}}>
            <i className='fa fa-home fa-fw'/> Home
          </Link>
          <Link to='snippets' params={{planetName: currentPlanetName}}>
            <i className='fa fa-code fa-fw'/> Snippets
          </Link>
          <Link to='blueprint' params={{planetName: currentPlanetName}}>
            <i className='fa fa-wrench fa-fw'/> Blueprints
          </Link>
        </nav>
      </div>
    )
  }
})

var Screen = React.createClass({
  render: function () {
    return (
      <div className='Screen'>
        <RouteHandler/>
      </div>
    )
  }
})

module.exports = React.createClass({
  mixins: [ReactRouter.Navigation],
  propTypes: {
    params: React.PropTypes.object,
    planetName: React.PropTypes.string
  },
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
    if (currentPlanet == null) {
      var redirectTo = userPlanets[0].name
      this.transitionTo('planet', {planetName: redirectTo})
      return (
        <div className='PlanetContainer'>
          Redirecting...
        </div>
      )
    }

    return (
      <div className='PlanetContainer'>
        <PlanetNavigator currentPlanet={currentPlanet}/>
        <PlanetMain currentPlanet={currentPlanet}/>
      </div>
    )
  }
})
