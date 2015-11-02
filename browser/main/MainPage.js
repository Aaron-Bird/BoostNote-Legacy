import ipc from 'ipc'
import React, { PropTypes } from 'react'

var ContactModal = require('boost/components/modal/ContactModal')

export default class MainContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {updateAvailable: false}
  }

  componentDidMount () {
    ipc.on('update-available', function (message) {
      this.setState({updateAvailable: true})
    }.bind(this))
  }

  updateApp () {
    ipc.send('update-app', 'Deal with it.')
  }

  openContactModal () {
    this.openModal(ContactModal)
  }

  render () {
    return (
      <div className='Main'>
        {this.state.updateAvailable ? (
        <button onClick={this.updateApp} className='appUpdateButton'><i className='fa fa-cloud-download'/> Update available!</button>
        ) : null}
        {/* <button onClick={this.openContactModal} className='contactButton'>
          <i className='fa fa-paper-plane-o'/>
          <div className='tooltip'>Contact us</div>
        </button> */}
        {this.props.children}
      </div>
    )
  }
}

MainContainer.propTypes = {
  children: PropTypes.element
}
