/* global localStorage */

var React = require('react/addons')
var Select = require('react-select')

var Hq = require('../Services/Hq')

var LinkedState = require('../Mixins/LinkedState')

var UserStore = require('../Stores/UserStore')
var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [LinkedState],
  propTypes: {
    transitionTo: React.PropTypes.func,
    close: React.PropTypes.func
  },
  getInitialState: function () {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'))
    return {
      user: currentUser,
      planet: {
        name: '',
        OwnerId: currentUser.id,
        public: true
      }
    }
  },
  componentDidMount: function () {
    React.findDOMNode(this.refs.name).focus()
  },
  onListen: function (res) {
    if (res.status === 'planetCreated') {
      this.props.close()
    }
  },
  handleSubmit: function () {
    Hq.createPlanet(this.state.user.name, this.state.planet)
      .then(function (res) {
        var planet = res.body

        var currentUser = JSON.parse(localStorage.getItem('currentUser'))

        var isNew = !currentUser.Planets.some(function (_planet, index) {
          if (planet.id === _planet) {
            currentUser.Planets.splice(index, 1, planet)
            return true
          }
          return false
        })
        if (isNew) currentUser.Planets.push(planet)

        localStorage.setItem('currentUser', JSON.stringify(currentUser))
        UserStore.Actions.update(currentUser)
        this.props.transitionTo('planetHome', {userName: planet.userName, planetName: planet.name})
        this.props.close()
      }.bind(this))
      .catch(function (err) {
        console.error(err)
      })
  },
  render: function () {
    return (
      <div className='PlanetCreateModal modal'>
        <input ref='name' valueLink={this.linkState('planet.name')} className='nameInput stripInput' placeholder='Crate new Planet'/>

        <div className='formField'>
          of
          <select valueLink={this.linkState('planet.OwnerId')}>
            <option value={this.state.user.id}>Me({this.state.user.name})</option>
          </select>
          as
          <select valueLink={this.linkState('planet.public')}>
            <option value={true}>Public</option>
            <option value={false}>Private</option>
          </select>
        </div>

        <button onClick={this.handleSubmit} className='submitButton'>
          <i className='fa fa-check'/>
        </button>
      </div>
    )
  }
})
