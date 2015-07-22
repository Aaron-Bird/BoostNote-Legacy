var React = require('react')
var SnippetForm = require('./SnippetForm')

var SnippetEditModal = React.createClass({
  propTypes: {
    close: React.PropTypes.func,
    snippet: React.PropTypes.object
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
