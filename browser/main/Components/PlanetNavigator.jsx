var React = require('react/addons')
var ReactRouter = require('react-router')
var Navigation = ReactRouter.Navigation

var Modal = require('../Mixins/Modal')
var LaunchModal = require('../Components/LaunchModal')

var PlanetNavigator = React.createClass({
  mixins: [Modal, Navigation],
  propTypes: {
    planet: React.PropTypes.shape({
      name: React.PropTypes.string
    }),
    search: React.PropTypes.string,
    toggleCodeFilter: React.PropTypes.func,
    toggleNoteFilter: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      isLaunchModalOpen: false
    }
  },
  submitLaunchModal: function (ret) {
    this.setState({isLaunchModalOpen: false})
  },
  openLaunchModal: function () {
    this.openModal(LaunchModal, {planet: this.props.planet, transitionTo: this.transitionTo})
  },
  render: function () {
    var keywords = this.props.search.split(' ')
    var usingCodeFilter = keywords.some(function (keyword) {
      if (keyword === '$c') return true
      return false
    })
    var usingNoteFilter = keywords.some(function (keyword) {
      if (keyword === '$n') return true
      return false
    })

    return (
      <div className='PlanetNavigator'>
        <button onClick={this.openLaunchModal} className='launchButton btn-primary btn-block'>
          <i className='fa fa-rocket fa-fw'/> Launch
        </button>
        <nav className='articleFilters'>
          <a className={usingCodeFilter && !usingNoteFilter ? 'active' : ''} onClick={this.props.toggleCodeFilter}>
            <i className='fa fa-code fa-fw'/> Codes
          </a>
          <a className={!usingCodeFilter && usingNoteFilter ? 'active' : ''} onClick={this.props.toggleNoteFilter}>
            <i className='fa fa-file-text-o fa-fw'/> Notes
          </a>
        </nav>
      </div>
    )
  }
})

module.exports = PlanetNavigator
