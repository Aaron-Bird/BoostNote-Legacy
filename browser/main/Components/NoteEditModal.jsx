var React = require('react')

var NoteForm = require('./NoteForm')

module.exports = React.createClass({
  propTypes: {
    close: React.PropTypes.func,
    note: React.PropTypes.object,
    planet: React.PropTypes.object
  },
  render: function () {
    return (
      <div className='NoteEditModal modal'>
        <div className='modal-header'>
          <h1>Edit Note</h1>
        </div>
        <NoteForm note={this.props.note} planet={this.props.planet} close={this.props.close}/>
      </div>
    )
  }
})
