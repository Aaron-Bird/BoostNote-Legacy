var React = require('react')

var Hq = require('../Services/Hq')

var KeyCaster = require('../Mixins/KeyCaster')

var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [KeyCaster('noteDeleteModal')],
  propTypes: {
    planet: React.PropTypes.object,
    note: React.PropTypes.object,
    close: React.PropTypes.func
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'submitNoteDeleteModal':
        this.submit()
        break
      case 'closeModal':
        this.props.close()
        break
    }
  },
  submit: function () {
    var planet = this.props.planet
    Hq.destroyNote(planet.Owner.name, planet.name, this.props.note.localId)
      .then(function (res) {
        PlanetStore.Actions.destroyNote(res.body)
        this.props.close()
      }.bind(this))
      .catch(function (err) {
        console.error(err)
      })
  },
  render: function () {
    return (
      <div className='NoteDeleteModal modal'>
        <div className='modal-header'>
          <h1>Delete Note</h1>
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
