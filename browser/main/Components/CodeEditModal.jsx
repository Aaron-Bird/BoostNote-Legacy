var React = require('react')
var CodeForm = require('./CodeForm')

module.exports = React.createClass({
  propTypes: {
    close: React.PropTypes.func,
    code: React.PropTypes.object,
    planet: React.PropTypes.object
  },
  render: function () {
    return (
      <div className='CodeEditModal modal'>
        <div className='modal-header'>
          <h1>Edit Code</h1>
        </div>
        <CodeForm code={this.props.code} planet={this.props.planet} close={this.props.close}/>
      </div>
    )
  }
})
