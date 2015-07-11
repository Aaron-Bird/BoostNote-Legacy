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

var PlanetHeader = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.object,
    currentUser: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      isMenuDropDownOpen: false
    }
  },
  toggleMenuDropDown: function () {
    this.setState({isMenuDropDownOpen: !this.state.isMenuDropDownOpen}, function () {
      if (this.state.isMenuDropDownOpen) {
        document.body.onclick = function () {
          this.setState({isMenuDropDownOpen: false}, function () {
            document.body.onclick = null
          })
        }.bind(this)
      }
    })
  },
  interceptClick: function (e) {
    e.stopPropagation()
  },
  render: function () {
    var currentPlanetName = this.props.currentPlanet.name

    return (
      <div onClick={this.interceptClick} className='PlanetHeader'>
        <span className='planetName'>{currentPlanetName}</span>
        <button onClick={this.toggleMenuDropDown} className={this.state.isMenuDropDownOpen ? 'menuBtn active' : 'menuBtn'}>
          <i className='fa fa-chevron-down'></i>
        </button>
        <div className={this.state.isMenuDropDownOpen ? 'dropDown' : 'dropDown hide'} ref='menuDropDown'>
          <a href='#'><i className='fa fa-wrench fa-fw'/> Planet Setting</a>
          <a href='#'><i className='fa fa-group fa-fw'/> Manage member</a>
          <a href='#'><i className='fa fa-trash fa-fw'/> Delete Planet</a>
        </div>
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
            <i className='fa fa-file-text-o fa-fw'/> Blueprints
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
        <PlanetMain currentPlanet={currentPlanet} currentUser={currentUser}/>
      </div>
    )
  }
})
