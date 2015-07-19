var React = require('react/addons')

var PlanetHeader = React.createClass({
  propTypes: {
    currentPlanet: React.PropTypes.object,
    currentUser: React.PropTypes.object,
    onSearchChange: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      isMenuDropDownOpen: false,
      search: ''
    }
  },
  componentDidMount: function () {
    React.findDOMNode(this.refs.search).focus()
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
          <input onKeyDown={this.handleKeyDown} onChange={this.handleChange} value={this.state.search} ref='search' tabIndex='1' type='text' className='inline-input circleInput' placeholder='Search...'/>
        </span>
        <a className='downloadButtton btn-primary'>Download Mac app</a>
      </div>
    )
  }
})

module.exports = PlanetHeader
