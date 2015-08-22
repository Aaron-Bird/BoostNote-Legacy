var React = require('react')

var Hq = require('../Services/Hq')

var KeyCaster = require('../Mixins/KeyCaster')

var PlanetStore = require('../Stores/PlanetStore')

module.exports = React.createClass({
  mixins: [KeyCaster('codeDeleteModal')],
  propTypes: {
    planet: React.PropTypes.object,
    code: React.PropTypes.object,
    close: React.PropTypes.func
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'submitCodeDeleteModal':
        this.submit()
        break
      case 'closeModal':
        this.props.close()
        break
    }
  },
  submit: function () {
    var planet = this.props.planet
    Hq.destroyCode(planet.userName, planet.name, this.props.code.localId)
      .then(function (res) {
        PlanetStore.Actions.destroyCode(res.body)
        this.props.close()
      }.bind(this))
      .catch(function (err) {
        console.error(err)
      })
  },
  render: function () {
    return (
      <div className='CodeDeleteModal modal'>
        <div className='modal-header'>
          <h1>Delete Code</h1>
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
