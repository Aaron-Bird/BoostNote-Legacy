var React = require('react')
var PlanetStore = require('../Stores/PlanetStore')
var PlanetActions = require('../Actions/PlanetActions')

var BlueprintDeleteModal = React.createClass({
  propTypes: {
    close: React.PropTypes.func,
    blueprint: React.PropTypes.object
  },
  componentDidMount: function () {
    this.unsubscribe = PlanetStore.listen(this.onListen)
    React.findDOMNode(this.refs.submit).focus()
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  onListen: function (res) {
    switch (res.status) {
      case 'articleDeleted':
        this.props.close()
        break
    }
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
