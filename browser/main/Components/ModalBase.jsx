var React = require('react/addons')

var ModalBase = React.createClass({
  propTypes: {
    isOpen: React.PropTypes.bool,
    children: React.PropTypes.element,
    close: React.PropTypes.func
  },
  render: function () {
    if (this.props.isOpen) {
      return (
        <div ref='modal' onClick={this.props.close} className='ModalBase'>
          {this.props.children}
        </div>
      )
    }
    return (
      <div className='Modal hide'></div>
    )
  }
})

module.exports = ModalBase
