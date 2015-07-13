var React = require('react/addons')
var ReactRouter = require('react-router')
var ModalBase = require('../Components/ModalBase')
var LaunchModal = require('../Components/LaunchModal')
var CodeViewer = require('../Components/CodeViewer')

var AuthStore = require('../Stores/AuthStore')
var PlanetStore = require('../Stores/PlanetStore')

var PlanetActions = require('../Actions/PlanetActions')

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
var PlanetNavigator = React.createClass({
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
    return (
      <div className='PlanetNavigator'>
        <button onClick={this.openLaunchModal} className='btn-primary btn-block'>
          <i className='fa fa-rocket fa-fw'/> Launch
        </button>
        <ModalBase isOpen={this.state.isLaunchModalOpen} close={this.closeLaunchModal}>
          <LaunchModal submit={this.submitLaunchModal} close={this.closeLaunchModal}/>
        </ModalBase>
        <nav>
          <a>
            <i className='fa fa-home fa-fw'/> Home
          </a>
          <a>
            <i className='fa fa-code fa-fw'/> Snippets
          </a>
          <a>
            <i className='fa fa-file-text-o fa-fw'/> Blueprints
          </a>
        </nav>
      </div>
    )
  }
})

var PlanetArticleList = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State],
  propTypes: {
    planet: React.PropTypes.shape({
      Snippets: React.PropTypes.array,
      Blueprints: React.PropTypes.array
    })
  },
  render: function () {
    var articles = this.props.planet.Snippets.map(function (snippet) {
      var tags = snippet.Tags.map(function (tag) {
        return (
          <a key={tag.id} href>#{tag.name}</a>
        )
      })
      var params = this.getParams()

      var isActive = parseInt(params.localId, 10) === snippet.localId

      var handleClick = function () {
        this.transitionTo('snippets', {
          userName: params.userName,
          planetName: params.planetName,
          localId: snippet.localId
        })
      }.bind(this)

      return (
        <li onClick={handleClick} className={isActive ? 'active' : ''} key={snippet.id}>
          <div className='callSign'><i className='fa fa-code'></i> {snippet.callSign}</div>
          <div className='description'>{snippet.description}</div>
          <div className='updatedAt'>{snippet.updatedAt}</div>
          <div className='tags'><i className='fa fa-tags'/>{tags}</div>
        </li>
      )
    }.bind(this))

    return (
      <div className='PlanetArticleList'>
        <ul>
          {articles}
        </ul>
      </div>
    )
  }
})

var PlanetArticleDetail = React.createClass({
  propTypes: {
    snippet: React.PropTypes.object
  },
  render: function () {
    var snippet = this.props.snippet

    var tags = snippet.Tags.map(function (tag) {
      return (
        <a key={tag.id} href>#{tag.name}</a>
      )
    })

    return (
      <div className='PlanetArticleDetail'>
        <div className='viewer-header'>
          <i className='fa fa-code'></i> {snippet.callSign} <small className='updatedAt'>{snippet.updatedAt}</small>
          <span className='control-group'>
            <button className='btn-default btn-square btn-sm'><i className='fa fa-edit fa-fw'></i></button>
            <button className='btn-default btn-square btn-sm'><i className='fa fa-trash fa-fw'></i></button>
          </span>
        </div>
        <div className='viewer-body'>
          <div className='viewer-detail'>
            <div className='description'>{snippet.description}</div>
            <div className='tags'><i className='fa fa-tags'/>{tags}</div>
          </div>
          <div className='content'>
            <CodeViewer code={snippet.content} mode={snippet.mode}/>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = React.createClass({
  mixins: [ReactRouter.Navigation, ReactRouter.State],
  propTypes: {
    params: React.PropTypes.object,
    planetName: React.PropTypes.string
  },
  getInitialState: function () {
    return {
      currentPlanet: null
    }
  },
  componentDidMount: function () {
    this.unsubscribe = PlanetStore.listen(this.onFetched)

    PlanetActions.fetchPlanet(this.props.params.userName + '/' + this.props.params.planetName)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  onFetched: function (planet) {
    this.setState({currentPlanet: planet}, function () {
      if (planet.Snippets.length > 0) {
        this.transitionTo('snippets', {
          userName: this.props.params.userName,
          planetName: this.props.params.planetName,
          localId: planet.Snippets[0].localId})
      }
    })
  },
  render: function () {
    var user = AuthStore.getUser()
    if (user == null) return (<div/>)
    if (this.state.currentPlanet == null) return (<div/>)

    var content = (<div>No selected</div>)
    if (this.isActive('snippets')) {
      var localId = parseInt(this.props.params.localId, 10)

      this.state.currentPlanet.Snippets.some(function (_snippet) {
        if (localId === _snippet.localId) {
          content = (
            <PlanetArticleDetail snippet={_snippet}/>
          )
          return true
        }
        return false
      })
    }

    return (
      <div className='PlanetContainer'>
        <PlanetHeader currentPlanet={this.state.currentPlanet} currentUser={user}/>
        <PlanetNavigator currentPlanet={this.state.currentPlanet} currentUser={user}/>
        <PlanetArticleList planet={this.state.currentPlanet}/>
        {content}
      </div>
    )
  }
})
