var React = require('react/addons')

var PlanetHeader = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    onSearchChange: React.PropTypes.func
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
  handleChange: function (e) {
    this.setState({search: e.target.value})
    this.props.onSearchChange(e.target.value)
  },
  handleKeyDown: function (e) {
    if (e.keyCode === 27) {
      React.findDOMNode(this.refs.search).blur()
    }
  },
  render: function () {
    var currentPlanetName = this.props.currentPlanet.name
    var currentUserName = this.props.currentUser.name

    return (
      <div onClick={this.interceptClick} className='PlanetHeader'>
        <div className='headerLabel'>
          <span className='userName'>{currentUserName}</span><br/>
          <span className='divider'>/</span>
          <span className='planetName'>{currentPlanetName}</span>
          <button className={'menuBtn'}>
            <i className='fa fa-gears'></i>
          </button>
        </div>
        <div className='headerControl'>
          <span className='searchInput'>
            <i className='fa fa-search'/>
            <input onKeyDown={this.handleKeyDown} onChange={this.handleChange} value={this.state.search} ref='search' tabIndex='1' type='text' className='inline-input circleInput' placeholder='Search...'/>
          </span>
          <a className='downloadButtton btn-primary'>Download Mac app</a>
        </div>
      </div>
    )
  }
})

module.exports = PlanetHeader
