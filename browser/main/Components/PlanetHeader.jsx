var React = require('react/addons')
var ReactRouter = require('react-router')
var Link = ReactRouter.Link

var Modal = require('../Mixins/Modal')
var ExternalLink = require('../Mixins/ExternalLink')

var PlanetSettingModal = require('./PlanetSettingModal')

module.exports = React.createClass({
  mixins: [ReactRouter.State, Modal, ExternalLink],
  propTypes: {
    search: React.PropTypes.string,
    fetchPlanet: React.PropTypes.func,
    onSearchChange: React.PropTypes.func,
    currentPlanet: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      search: ''
    }
  },
  componentDidMount: function () {
    var search = React.findDOMNode(this.refs.search)
    search.addEventListener('keydown', this.handleSearchKeyDown)
  },
  componentWillUnmount: function () {
    var search = React.findDOMNode(this.refs.search)
    search.removeEventListener('keydown', this.handleSearchKeyDown)
  },
  handleSearchKeyDown: function (e) {
    if (e.keyCode === 38 || e.keyCode === 40) {
      var search = React.findDOMNode(this.refs.search)
      search.blur()
    }
    if (e.keyCode !== 27 && (e.keyCode !== 13 || !e.metaKey)) {
      e.stopPropagation()
    }
  },
  openPlanetSettingModal: function () {
    this.openModal(PlanetSettingModal, {planet: this.props.currentPlanet})
  },
  refresh: function () {
    this.props.fetchPlanet()
  },
  render: function () {
    var currentPlanetName = this.props.currentPlanet.name
    var currentUserName = this.props.currentPlanet.userName

    return (
      <div className='PlanetHeader'>
        <div className='headerLabel'>
          <Link to='userHome' params={{userName: currentUserName}} className='userName'>{currentUserName}</Link>
          <span className='planetName'>{currentPlanetName}</span>

          {this.props.currentPlanet.public ? null : (
            <div className='private'>
              <i className='fa fa-lock'/>
              <div className='tooltip'>Private planet</div>
            </div>
          )}

          <button onClick={this.openPlanetSettingModal} className='planetSettingButton'>
            <i className='fa fa-chevron-down'></i>
            <div className='tooltip'>Planet setting</div>
          </button>
        </div>
        <div className='headerControl'>
          <div className='searchInput'>
            <i className='fa fa-search'/>
            <input onChange={this.props.onSearchChange} value={this.props.search} ref='search' type='text' className='inline-input circleInput' placeholder='Search...'/>
          </div>
          <button onClick={this.refresh} className='refreshButton'>
            <i className='fa fa-refresh'/>
            <div className='tooltip'>Refresh planet</div>
          </button>
          <a onClick={this.openExternal} href='http://b00st.io' className='logo'>
            <img width='44' height='44' src='resources/favicon-230x230.png'/>
            <div className='tooltip'>Boost official page</div>
          </a>
        </div>
      </div>
    )
  }
})
