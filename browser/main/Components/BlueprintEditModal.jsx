var React = require('react')

var BlueprintForm = require('./BlueprintForm')

var BlueprintEditModal = React.createClass({
  propTypes: {
    close: React.PropTypes.func,
    blueprint: React.PropTypes.object
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
