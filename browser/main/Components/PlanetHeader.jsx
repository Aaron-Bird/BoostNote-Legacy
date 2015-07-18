var React = require('react/addons')

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

module.exports = PlanetHeader
