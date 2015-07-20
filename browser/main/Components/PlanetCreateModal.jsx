var React = require('react/addons')
var Catalyst = require('../Mixins/Catalyst')

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
  handleSubmit: function () {
    console.log(this.state.planetName)
  },
  stopPropagation: function (e) {
    e.stopPropagation()
  },
  render: function () {
    return (
      <div onClick={this.stopPropagation} className='PlanetCreateModal modal'>
        <input valueLink={this.linkState('planetName')} className='stripInput'/>
        <button onClick={this.handleSubmit} className='submitButton'>
          <i className='fa fa-check'/>
        </button>
      </div>
    )
  }
})
