const electron = require('electron')
const ipc = electron.ipcRenderer
import React, { PropTypes } from 'react'
import HomePage from './HomePage'

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

  render () {
    return (
      <div className='Main'>
        {this.state.updateAvailable ? (
        <button onClick={this.updateApp} className='appUpdateButton'><i className='fa fa-cloud-download'/> Update available!</button>
        ) : null}
        <HomePage/>
      </div>
    )
  }
}

MainContainer.propTypes = {
  children: PropTypes.element
}
