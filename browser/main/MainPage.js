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

  handleWheel (e) {
    if (e.ctrlKey && process.platform !== 'darwin') {
      if (window.document.body.style.zoom == null) {
        window.document.body.style.zoom = 1
      }
      console.log(window.document.body.style.zoom)
      let zoom = Number(window.document.body.style.zoom)
      if (e.deltaY > 0 && zoom < 4) {
        document.body.style.zoom = zoom + 0.05
      } else if (e.deltaY < 0 && zoom > 0.5) {
        document.body.style.zoom = zoom - 0.05
      }
    }
  }

  render () {
    return (
      <div
        className='Main'
        onWheel={(e) => this.handleWheel(e)}
      >
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
