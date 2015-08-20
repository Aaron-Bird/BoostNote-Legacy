var React = require('react/addons')
var ModalBase = React.createClass({
  getInitialState: function () {
    return {
      component: null,
      componentProps: {},
      isHidden: true
    }
  },
  close: function () {
    this.setState({component: null, componentProps: null, isHidden: true})
  },
  render: function () {
    var componentProps = this.state.componentProps
    return (
      <div className={'ModalBase' + (this.state.isHidden ? ' hide' : '')}>
        <div onClick={this.close} className='modalBack'/>
        {this.state.component == null ? null : (
          <this.state.component {...componentProps} close={this.close}/>
        )}
      </div>
    )
  }
})

var modalBase = null

module.exports = {
  componentDidMount: function () {
    if (modalBase == null) {
      var el = document.createElement('div')
      document.body.appendChild(el)
      modalBase = React.render(<ModalBase/>, el)
    }
  },
  openModal: function (component, props) {
    modalBase.setState({component: component, componentProps: props, isHidden: false})
  },
  closeModal: function () {
    modalBase.setState({isHidden: true})
  }
}
