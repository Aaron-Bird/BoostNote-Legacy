var React = require('react/addons')
var md5 = require('md5')

module.exports = React.createClass({
  propTypes: {
    email: React.PropTypes.string,
    size: React.PropTypes.string,
    className: React.PropTypes.string
  },
  render: function () {
    return (
      <img className={this.props.className} width={this.props.size} height={this.props.size} src={'http://www.gravatar.com/avatar/' + md5(this.props.email.trim().toLowerCase()) + '?s=' + this.props.size}/>
    )
  }
})
