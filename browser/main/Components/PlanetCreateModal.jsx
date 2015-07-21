var React = require('react/addons')
var Catalyst = require('../Mixins/Catalyst')

var PlanetActions = require('../Actions/PlanetActions')

var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [Catalyst.LinkedStateMixin],
  propTypes: {
    close: React.PropTypes.func
  },
  getInitialState: function () {
    return {
      planetName: ''
    }
  },
  componentDidMount: function () {
    React.findDOMNode(this.refs.name).focus()
    this.unsubscribe = PlanetStore.listen(this.onListen)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  onListen: function (res) {
    if (res.status === 'planetCreated') {
      this.props.close()
    }
  },
  handleSubmit: function () {
    PlanetActions.createPlanet({
      name: this.state.planetName
    })
  },
  handleKeyDown: function (e) {
    if (e.keyCode === 13 && e.metaKey) {
      this.handleSubmit()
      return
    }
    if (e.keyCode === 27) {
      this.props.close()
    }
  },
  stopPropagation: function (e) {
    e.stopPropagation()
  },
  render: function () {
    return (
      <div tabIndex='3' onKeyDown={this.handleKeyDown} onClick={this.stopPropagation} className='PlanetCreateModal modal'>
        <input ref='name' valueLink={this.linkState('planetName')} className='nameInput stripInput' placeholder='Crate new Planet'/>
        <button onClick={this.handleSubmit} className='submitButton'>
          <i className='fa fa-check'/>
        </button>
      </div>
    )
  }
})
