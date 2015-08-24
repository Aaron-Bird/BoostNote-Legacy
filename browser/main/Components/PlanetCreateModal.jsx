/* global localStorage */

var React = require('react/addons')

var Hq = require('../Services/Hq')

var LinkedState = require('../Mixins/LinkedState')
var KeyCaster = require('../Mixins/KeyCaster')

var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [LinkedState, KeyCaster('planetCreateModal')],
  propTypes: {
    ownerName: React.PropTypes.string,
    transitionTo: React.PropTypes.func,
    close: React.PropTypes.func
  },
  getInitialState: function () {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'))
    var ownerName = this.props.ownerName != null ? this.props.ownerName : currentUser.name
    return {
      user: currentUser,
      planet: {
        name: '',
        public: true
      },
      ownerName: ownerName
    }
  },
  componentDidMount: function () {
    React.findDOMNode(this.refs.name).focus()
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'closeModal':
        this.props.close()
        break
      case 'submitPlanetCreateModal':
        this.handleSubmit()
        break
    }
  },
  handleSubmit: function () {
    this.setState({errorMessage: null}, function () {
      Hq.createPlanet(this.state.ownerName, this.state.planet)
        .then(function (res) {
          var planet = res.body

          PlanetStore.Actions.update(planet)

          if (this.props.transitionTo != null) {
            this.props.transitionTo('planetHome', {userName: planet.userName, planetName: planet.name})
          }

          this.props.close()
        }.bind(this))
        .catch(function (err) {
          console.error(err)
          if (err.status === 403) {
            this.setState({errorMessage: err.response.body.message})
          }
        }.bind(this))
    })
  },
  render: function () {
    var teamOptions = this.state.user.Teams.map(function (team) {
      return (
        <option key={'user-' + team.id} value={team.name}>{team.profileName} ({team.name})</option>
      )
    })
    return (
      <div className='PlanetCreateModal modal'>
        <input ref='name' valueLink={this.linkState('planet.name')} className='nameInput stripInput' placeholder='Crate new Planet'/>

        <div className='formField'>
          of
          <select valueLink={this.linkState('ownerName')}>
            <option value={this.state.user.name}>Me({this.state.user.name})</option>
            {teamOptions}
          </select>
          as
          <select valueLink={this.linkState('planet.public')}>
            <option value={true}>Public</option>
            <option value={false}>Private</option>
          </select>
        </div>

        {this.state.errorMessage != null ? (<p className='errorAlert'>{this.state.errorMessage}</p>) : null}

        <button onClick={this.handleSubmit} className='submitButton'>
          <i className='fa fa-check'/>
        </button>
      </div>
    )
  }
})
