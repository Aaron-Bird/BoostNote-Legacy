var React = require('react')

var PlanetActions = require('../Actions/PlanetActions')

var BlueprintDeleteModal = React.createClass({
  propTypes: {
    close: React.PropTypes.func,
    blueprint: React.PropTypes.object
  },
  stopPropagation: function (e) {
    e.stopPropagation()
  },
  handleKeyDown: function (e) {
    if ((e.keyCode === 13 && e.metaKey)) {
      e.preventDefault()
      this.submit()
    }
  },
  submit: function () {
    PlanetActions.deleteBlueprint(this.props.blueprint.id)
  },
  render: function () {
    return (
      <div onKeyDown={this.handleKeyDown} onClick={this.stopPropagation} className='BlueprintDeleteModal modal'>
        <div className='modal-header'>
          <h1>Delete Blueprint</h1>
        </div>
        <div className='modal-body'>
          <p>Are you sure to delete it?</p>
        </div>
        <div className='modal-footer'>
          <div className='modal-control'>
            <button onClick={this.props.close} className='btn-default'>Cancel</button>
            <button ref='submit' onClick={this.submit} className='btn-primary'>Delete</button>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = BlueprintDeleteModal
