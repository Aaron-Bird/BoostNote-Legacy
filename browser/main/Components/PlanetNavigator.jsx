var React = require('react')
var ReactRouter = require('react-router')
var Navigation = ReactRouter.Navigation

var Modal = require('../Mixins/Modal')

var LaunchModal = require('../Components/LaunchModal')

module.exports = React.createClass({
  mixins: [Modal, Navigation],
  propTypes: {
    planet: React.PropTypes.shape({
      name: React.PropTypes.string,
      Owner: React.PropTypes.shape({
        id: React.PropTypes.number,
        userType: React.PropTypes.string
      })
    }),
    search: React.PropTypes.string,
    toggleCodeFilter: React.PropTypes.func,
    toggleNoteFilter: React.PropTypes.func,
    currentUser: React.PropTypes.shape({
      id: React.PropTypes.number,
      userType: React.PropTypes.string,
      Teams: React.PropTypes.array
    })
  },
  getInitialState: function () {
    return {
      isLaunchModalOpen: false
    }
  },
  openLaunchModal: function () {
    this.openModal(LaunchModal, {planet: this.props.planet, transitionTo: this.transitionTo})
  },
  isMyPlanet: function () {
    if (this.props.currentUser == null) return false
    if (this.props.planet.Owner.userType === 'person' && this.props.planet.Owner.id !== this.props.currentUser.id) return false
    if (this.props.planet.Owner.userType === 'team' && !this.props.currentUser.Teams.some(function (team) {
      if (team.id === this.props.planet.Owner.id) return true
      return false
    }.bind(this))) return false

    return true

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
        {this.isMyPlanet() ? (
          <button onClick={this.openLaunchModal} className='launchButton btn-primary btn-block'>
            <i className='fa fa-rocket fa-fw'/> Launch
          </button>
        ) : null}
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
