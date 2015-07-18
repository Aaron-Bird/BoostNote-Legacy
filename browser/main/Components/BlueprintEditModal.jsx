var React = require('react')
var BlueprintForm = require('./BlueprintForm')
var PlanetStore = require('../Stores/PlanetStore')

var BlueprintEditModal = React.createClass({
  propTypes: {
    close: React.PropTypes.func,
    blueprint: React.PropTypes.object
  },
  componentDidMount: function () {
    this.unsubscribe = PlanetStore.listen(this.onListen)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  onListen: function (res) {
    switch (res.status) {
      case 'articleUpdated':
        this.props.close()
        break
    }
  },
  stopPropagation: function (e) {
    e.stopPropagation()
  },
  render: function () {
    return (
      <div onClick={this.stopPropagation} className='BlueprintEditModal modal'>
        <div className='modal-header'>
          <h1>Edit Blueprint</h1>
        </div>
        <BlueprintForm blueprint={this.props.blueprint} close={this.props.close}/>
      </div>
    )
  }
})

module.exports = BlueprintEditModal
