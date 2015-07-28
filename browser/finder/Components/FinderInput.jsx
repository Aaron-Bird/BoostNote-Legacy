var React = require('react/addons')

module.exports = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
    search: React.PropTypes.string
  },
  render: function () {
    return (
      <div className='FinderInput'>
        <input value={this.props.search} onChange={this.props.onChange} type='text'/>
      </div>
    )
  }
})
