var React = require('react')
var SnippetForm = require('./SnippetForm')
var PlanetStore = require('../Stores/PlanetStore')

var SnippetEditModal = React.createClass({
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
      case 'snippetUpdated':
        this.props.close()
        break
    }
  },
  stopPropagation: function (e) {
    e.stopPropagation()
  },
  render: function () {
    return (
      <div onClick={this.stopPropagation} className='SnippetEditModal modal'>
        <div className='modal-header'>
          <h1>Edit Snippet</h1>
        </div>
        <SnippetForm snippet={this.props.snippet} close={this.props.close}/>
      </div>
    )
  }
})

module.exports = SnippetEditModal
