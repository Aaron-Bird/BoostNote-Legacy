var React = require('react/addons')

var PlanetHeader = React.createClass({
  propTypes: {
    openSettingModal: React.PropTypes.func,
    currentPlanet: React.PropTypes.object,
    onSearchChange: React.PropTypes.func,
    search: React.PropTypes.string
  },
  getInitialState: function () {
    return {
      search: ''
    }
  },
  componentDidMount: function () {
    React.findDOMNode(this.refs.search).focus()
  },
  interceptClick: function (e) {
    e.stopPropagation()
  },
  render: function () {
    var currentPlanetName = this.props.currentPlanet.name
    var currentUserName = this.props.currentPlanet.userName

    return (
      <div onClick={this.interceptClick} className='PlanetHeader'>
        <div className='headerLabel'>
          <span className='userName'>{currentUserName}</span><br/>
          <span className='planetName'>{currentPlanetName}</span>
          <button onClick={this.props.openSettingModal} className='menuBtn'>
            <i className='fa fa-chevron-down'></i>
          </button>
        </div>
        <div className='headerControl'>
          <div className='searchInput'>
            <i className='fa fa-search'/>
            <input onChange={this.props.onSearchChange} value={this.props.search} ref='search' tabIndex='1' type='text' className='inline-input circleInput' placeholder='Search...'/>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = PlanetHeader
