import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './StatusBar.styl'
import ZoomManager from 'browser/main/lib/ZoomManager'

const electron = require('electron')
const ipc = electron.ipcRenderer
const { remote } = electron
const { Menu, MenuItem } = remote

class StatusBar extends React.Component {
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

  handleZoomButtonClick (e) {
    let menu = new Menu()
    menu.append(new MenuItem({
      label: '130%',
      click: () => this.handleZoomMenuItemClick(1.3)
    }))
    menu.append(new MenuItem({
      label: '120%',
      click: () => this.handleZoomMenuItemClick(1.2)
    }))
    menu.append(new MenuItem({
      label: '110%',
      click: () => this.handleZoomMenuItemClick(1.1)
    }))
    menu.append(new MenuItem({
      label: '100%',
      click: () => this.handleZoomMenuItemClick(1)
    }))
    menu.append(new MenuItem({
      label: '90%',
      click: () => this.handleZoomMenuItemClick(0.9)
    }))
    menu.append(new MenuItem({
      label: '80%',
      click: () => this.handleZoomMenuItemClick(0.8)
    }))
    menu.popup(remote.getCurrentWindow())
  }

  handleZoomMenuItemClick (zoomFactor) {
    let { dispatch } = this.props
    ZoomManager.setZoom(zoomFactor)
    dispatch({
      type: 'SET_ZOOM',
      zoom: zoomFactor
    })
  }

  render () {
    let { config } = this.props
    return (
      <div className='StatusBar'
        styleName='root'
      >
        {this.state.updateAvailable
          ? <button onClick={this.updateApp} styleName='update'>
            <i className='fa fa-cloud-download'/> Update is available!
          </button>
          : null
        }
        <button styleName='zoom'
          onClick={(e) => this.handleZoomButtonClick(e)}
        >
          <i className='fa fa-search-plus'/>&nbsp;
          {Math.floor(config.zoom * 100)}%
        </button>
      </div>
    )
  }
}

StatusBar.propTypes = {
  config: PropTypes.shape({
    zoom: PropTypes.number
  })
}

export default CSSModules(StatusBar, styles)
