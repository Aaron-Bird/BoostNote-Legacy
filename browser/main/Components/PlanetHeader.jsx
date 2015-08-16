var shell = require('shell')

var React = require('react/addons')
var ReactRouter = require('react-router')

module.exports = React.createClass({
  mixins: [ReactRouter.State],
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
    React.findDOMNode(this.refs.search).focus()
  },
  handleLogoClick: function (e) {
    shell.openExternal('http://b00st.io')
    e.preventDefault()
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
          <span className='userName'>{currentUserName}</span><br/>
          <span className='planetName'>{currentPlanetName}</span>
          <button className='menuBtn'>
            <i className='fa fa-chevron-down'></i>
          </button>
        </div>
        <div className='headerControl'>
          <div className='searchInput'>
            <i className='fa fa-search'/>
            <input onChange={this.props.onSearchChange} value={this.props.search} ref='search' type='text' className='inline-input circleInput' placeholder='Search...'/>
          </div>
          <button onClick={this.refresh} className='refreshButton'><i className='fa fa-refresh'/></button>
          <a onClick={this.handleLogoClick} href='http://b00st.io' className='logo'>
            <img width='44' height='44' src='resources/favicon-230x230.png'/>
          </a>
        </div>
      </div>
    )
  }
})
