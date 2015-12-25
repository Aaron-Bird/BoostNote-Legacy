import React, { PropTypes } from 'react'
import linkState from 'browser/lib/linkState'
import { updateUser } from '../../actions'

const electron = require('electron')
const ipc = electron.ipcRenderer
const remote = electron.remote

export default class AppSettingTab extends React.Component {
  constructor (props) {
    super(props)
    let keymap = remote.getGlobal('keymap')
    let userName = props.user != null ? props.user.name : null

    this.state = {
      user: {
        name: userName,
        alert: null
      },
      userAlert: null,
      keymap: {
        toggleFinder: keymap.toggleFinder
      },
      keymapAlert: null
    }
  }

  componentDidMount () {
    this.handleSettingDone = () => {
      this.setState({keymapAlert: {
        type: 'success',
        message: 'Successfully done!'
      }})
    }
    this.handleSettingError = err => {
      this.setState({keymapAlert: {
        type: 'error',
        message: err.message != null ? err.message : 'Error occurs!'
      }})
    }
    ipc.addListener('APP_SETTING_DONE', this.handleSettingDone)
    ipc.addListener('APP_SETTING_ERROR', this.handleSettingError)
  }

  componentWillUnmount () {
    ipc.removeListener('APP_SETTING_DONE', this.handleSettingDone)
    ipc.removeListener('APP_SETTING_ERROR', this.handleSettingError)
  }

  submitHotKey () {
    ipc.send('hotkeyUpdated', {
      toggleFinder: this.state.keymap.toggleFinder
    })
  }

  handleSaveButtonClick (e) {
    this.submitHotKey()
  }

  handleKeyDown (e) {
    if (e.keyCode === 13) {
      this.submitHotKey()
    }
  }

  handleNameSaveButtonClick (e) {
    let { dispatch } = this.props

    dispatch(updateUser({name: this.state.user.name}))
    this.setState({
      userAlert: {
        type: 'success',
        message: 'Successfully done!'
      }
    })
  }

  render () {
    let keymapAlert = this.state.keymapAlert
    let keymapAlertElement = keymapAlert != null
      ? (
        <p className={`alert ${keymapAlert.type}`}>
          {keymapAlert.message}
        </p>
      ) : null
    let userAlert = this.state.userAlert
    let userAlertElement = userAlert != null
      ? (
        <p className={`alert ${userAlert.type}`}>
          {userAlert.message}
        </p>
      ) : null

    return (
      <div className='AppSettingTab content'>
        <div className='section'>
          <div className='sectionTitle'>User's info</div>
          <div className='sectionInput'>
            <label>User name</label>
            <input valueLink={this.linkState('user.name')} type='text'/>
          </div>
          <div className='sectionConfirm'>
            <button onClick={e => this.handleNameSaveButtonClick(e)}>Save</button>
            {userAlertElement}
          </div>
        </div>
        <div className='section'>
          <div className='sectionTitle'>Hotkey</div>
          <div className='sectionInput'>
            <label>Toggle Finder(popup)</label>
            <input onKeyDown={e => this.handleKeyDown(e)} valueLink={this.linkState('keymap.toggleFinder')} type='text'/>
          </div>
          <div className='sectionConfirm'>
            <button onClick={e => this.handleSaveButtonClick(e)}>Save</button>
            {keymapAlertElement}
          </div>
          <div className='description'>
            <ul>
              <li><code>0</code> to <code>9</code></li>
              <li><code>A</code> to <code>Z</code></li>
              <li><code>F1</code> to <code>F24</code></li>
              <li>Punctuations like <code>~</code>, <code>!</code>, <code>@</code>, <code>#</code>, <code>$</code>, etc.</li>
              <li><code>Plus</code></li>
              <li><code>Space</code></li>
              <li><code>Backspace</code></li>
              <li><code>Delete</code></li>
              <li><code>Insert</code></li>
              <li><code>Return</code> (or <code>Enter</code> as alias)</li>
              <li><code>Up</code>, <code>Down</code>, <code>Left</code> and <code>Right</code></li>
              <li><code>Home</code> and <code>End</code></li>
              <li><code>PageUp</code> and <code>PageDown</code></li>
              <li><code>Escape</code> (or <code>Esc</code> for short)</li>
              <li><code>VolumeUp</code>, <code>VolumeDown</code> and <code>VolumeMute</code></li>
              <li><code>MediaNextTrack</code>, <code>MediaPreviousTrack</code>, <code>MediaStop</code> and <code>MediaPlayPause</code></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

AppSettingTab.prototype.linkState = linkState
AppSettingTab.propTypes = {
  dispatch: PropTypes.func
}
