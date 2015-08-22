var React = require('react')
var CodeForm = require('./CodeForm')

module.exports = React.createClass({
  propTypes: {
    close: React.PropTypes.func,
    code: React.PropTypes.object,
    planet: React.PropTypes.object
  },
  componentDidMount: function () {
    // TODO: Hacked!! should fix later
    setTimeout(function () {
      React.findDOMNode(this.refs.form.refs.description).focus()
    }.bind(this), 1)
  },
  render: function () {
    return (
      <div className='CodeEditModal modal'>
        <div className='modal-header'>
          <h1>Edit Code</h1>
        </div>
        <CodeForm ref='form' code={this.props.code} planet={this.props.planet} close={this.props.close}/>
      </div>
    )
  }
})
