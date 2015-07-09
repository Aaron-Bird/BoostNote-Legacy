var React = require('react/addons')
var RouteHandler = require('react-router').RouteHandler
var ReactRouter = require('react-router')
var Link = ReactRouter.Link
var ModalBase = require('../Components/ModalBase')
var LaunchModal = require('../Components/LaunchModal')

var currentUser = {
  name: 'testcat',
  email: 'testcat@example.com',
  profileName: 'Test Cat'
}

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
    currentPlanet: React.PropTypes.object,
    currentUser: React.PropTypes.object
  },
  render: function () {
    var planets = userPlanets.map(function (planet, index) {
      return (
        <li key={planet.id} className={this.props.currentPlanet.name === planet.name ? 'active' : ''}>
          <a>{planet.profileName[0]}</a>
          <div className='shortCut'>⌘{index + 1}</div>
        </li>
      )
    }.bind(this))

    return (
      <div className='PlanetNavigator'>
        <a className='userConfig'>
          <img width='50' height='50' src='../vendor/dummy.jpg'/>
        </a>
        <ul>
          {planets}
        </ul>
        <button className='newPlanet'><i className='fa fa-plus'/></button>
      </div>
    )
  }
})

var PlanetHeader = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.object,
    currentUser: React.PropTypes.object
  },
  render: function () {
    var currentPlanetName = this.props.currentPlanet.name

    return (
      <div className='PlanetHeader'>
        <span className='planetName'>{currentPlanetName}</span>
        <button className='menuBtn'>
          <i className='fa fa-chevron-down'></i>
        </button>
        <span className='searchInput'>
          <i className='fa fa-search'/>
          <input type='text' className='inline-input circleInput' placeholder='Search...'/>
        </span>
        <a className='downloadBtn btn-primary'>Download Mac app</a>
      </div>
    )
  }
})

var PlanetMain = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.object,
    currentUser: React.PropTypes.object
  },
  render: function () {
    return (
      <div className='PlanetMain'>
        <PlanetHeader currentPlanet={this.props.currentPlanet} currentUser={this.props.currentUser}/>
        <SideNavigator currentPlanet={this.props.currentPlanet} currentUser={this.props.currentUser}/>
        <PlanetBody currentPlanet={this.props.currentPlanet}/>
      </div>
    )
  }
})

var SideNavigator = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.shape({
      name: React.PropTypes.string
    }),
    currentUser: React.PropTypes.shape({
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
    var currentUserName = this.props.currentUser.name

    return (
      <div className='SideNavigator'>
        <button onClick={this.openLaunchModal} className='btn-primary btn-block'>
          <i className='fa fa-rocket fa-fw'/> Launch
        </button>
        <ModalBase isOpen={this.state.isLaunchModalOpen} close={this.closeLaunchModal}>
          <LaunchModal submit={this.submitLaunchModal} close={this.closeLaunchModal}/>
        </ModalBase>
        <nav>
          <Link to='dashboard' params={{userName: currentUserName, planetName: currentPlanetName}}>
            <i className='fa fa-home fa-fw'/> Home
          </Link>
          <Link to='snippets' params={{userName: currentUserName, planetName: currentPlanetName}}>
            <i className='fa fa-code fa-fw'/> Snippets
          </Link>
          <Link to='blueprint' params={{userName: currentUserName, planetName: currentPlanetName}}>
            <i className='fa fa-wrench fa-fw'/> Blueprints
          </Link>
        </nav>
      </div>
    )
  }
})

var PlanetBody = React.createClass({
  render: function () {
    return (
      <div className='PlanetBody'>
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
        <PlanetNavigator currentPlanet={currentPlanet} currentUser={currentUser}/>
        <PlanetMain currentPlanet={currentPlanet} currentUser={currentUser}/>
      </div>
    )
  }
})
