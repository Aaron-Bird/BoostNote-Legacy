import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './StatusBar.styl'
import ZoomManager from 'browser/main/lib/ZoomManager'

const electron = require('electron')
const ipc = electron.ipcRenderer
const { remote } = electron
const { Menu, MenuItem } = remote

const zoomOptions = [0.8, 0.9, 1, 1.1, 1.2, 1.3]

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

    zoomOptions.forEach((zoom) => {
      menu.append(new MenuItem({
        label: Math.floor(zoom * 100) + '%',
        click: () => this.handleZoomMenuItemClick(zoom)
      }))
    })

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
