import React from 'react'
import ReactDOM from 'react-dom'

const remote = require('electron').remote

class ModalBase extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      component: null,
      componentProps: {},
      isHidden: true
    }
  }

  close () {
    if (modalBase != null) modalBase.setState({component: null, componentProps: null, isHidden: true})
    document.body.setAttribute('data-modal', 'close')

    remote.getCurrentWebContents().send('list-focus')
  }

  render () {
    return (
      <div className={'ModalBase' + (this.state.isHidden ? ' hide' : '')}>
        <div onClick={e => this.close(e)} className='modalBack'/>
        {this.state.component == null ? null : (
          <this.state.component {...this.state.componentProps} close={this.close}/>
        )}
      </div>
    )
  }
}

let el = document.createElement('div')
document.body.appendChild(el)
let modalBase = ReactDOM.render(<ModalBase/>, el)

export function openModal (component, props) {
  if (modalBase == null) { return }

  document.body.setAttribute('data-modal', 'open')
  modalBase.setState({component: component, componentProps: props, isHidden: false})
}

export function closeModal () {
  if (modalBase == null) { return }
  modalBase.close()
}

export function isModalOpen () {
  return !modalBase.state.isHidden
}

export default {
  open: openModal,
  close: closeModal,
  isOpen: isModalOpen
}
