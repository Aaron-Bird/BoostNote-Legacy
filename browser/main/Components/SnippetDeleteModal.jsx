var React = require('react')
var PlanetStore = require('../Stores/PlanetStore')
var PlanetActions = require('../Actions/PlanetActions')

var SnippetDeleteModal = React.createClass({
  propTypes: {
    close: React.PropTypes.func,
    snippet: React.PropTypes.object
  },
  componentDidMount: function () {
    this.unsubscribe = PlanetStore.listen(this.onListen)
  },
  componentWillUnmount: function () {
    this.unsubscribe()
  },
  onListen: function (res) {
    switch (res.status) {
      case 'snippetDeleted':
        this.props.close()
        break
    }
  },
  stopPropagation: function (e) {
    e.stopPropagation()
  },
  submit: function () {
    PlanetActions.deleteSnippet(this.props.snippet.id)
  },
  render: function () {
    return (
      <div onClick={this.stopPropagation} className='SnippetDeleteModal modal'>
        <div className='modal-header'>
          <h1>Delete Snippet</h1>
        </div>
        <div className='modal-body'>
          <p>Are you sure to delete it?</p>
        </div>
        <div className='modal-footer'>
          <div className='modal-control'>
            <button onClick={this.props.close} className='btn-default'>Cancle</button>
            <button onClick={this.submit} className='btn-primary'>Delete</button>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = SnippetDeleteModal
