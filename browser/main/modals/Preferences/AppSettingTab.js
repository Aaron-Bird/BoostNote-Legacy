import React, { PropTypes } from 'react'
import fetchConfig from 'browser/lib/fetchConfig'
import hljsTheme from 'browser/lib/hljsThemes'

const electron = require('electron')
const ipc = electron.ipcRenderer
const remote = electron.remote
const ace = window.ace

const OSX = global.process.platform === 'darwin'

export default class AppSettingTab extends React.Component {
  constructor (props) {
    super(props)
    let keymap = Object.assign({}, remote.getGlobal('keymap'))
    let config = Object.assign({}, fetchConfig())
    let userName = props.user != null ? props.user.name : null

    this.state = {
      user: {
        name: userName,
        alert: null
      },
      userAlert: null,
      keymap: keymap,
      keymapAlert: null,
      config: config,
      configAlert: null
    }
  }

  componentDidMount () {
    this.handleSettingDone = () => {
      this.setState({keymapAlert: {
        type: 'success',
        message: 'Successfully done!'
      }})
    }
    this.handleSettingError = (err) => {
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
    ipc.send('hotkeyUpdated', this.state.keymap)
  }

  submitConfig () {
    ipc.send('configUpdated', this.state.config)
  }

  handleSaveButtonClick (e) {
    this.submitHotKey()
  }

  handleConfigSaveButtonClick (e) {
    this.submitConfig()
  }

  handleKeyDown (e) {
    if (e.keyCode === 13) {
      this.submitHotKey()
    }
  }

  handleConfigKeyDown (e) {
    if (e.keyCode === 13) {
      this.submitConfig()
    }
  }

  handleLineNumberingClick (e) {
    let config = this.state.config

    config['preview-line-number'] = e.target.checked
    this.setState({
      config
    })
  }

  handleDisableDirectWriteClick (e) {
    let config = this.state.config
    config['disable-direct-write'] = e.target.checked
    this.setState({
      config
    })
  }

  render () {
    let keymapAlert = this.state.keymapAlert
    let keymapAlertElement = keymapAlert != null
      ? <p className={`alert ${keymapAlert.type}`}>
        {keymapAlert.message}
      </p>
      : null
    let aceThemeList = ace.require('ace/ext/themelist')
    let hljsThemeList = hljsTheme()

    return (
      <div className='AppSettingTab content'>
        <div className='section'>
          <div className='sectionTitle'>Editor</div>
          <div className='sectionInput'>
            <label>Editor Font Size</label>
            <input valueLink={this.linkState('config.editor-font-size')} onKeyDown={(e) => this.handleConfigKeyDown(e)} type='text'/>
          </div>
          <div className='sectionInput'>
            <label>Editor Font Family</label>
            <input valueLink={this.linkState('config.editor-font-family')} onKeyDown={(e) => this.handleConfigKeyDown(e)} type='text'/>
          </div>
          <div className='sectionMultiSelect'>
            <label>Editor Indent Style</label>
            <div className='sectionMultiSelect-input'>
              type
              <select valueLink={this.linkState('config.editor-indent-type')}>
                <option value='space'>Space</option>
                <option value='tab'>Tab</option>
              </select>
              size
              <select valueLink={this.linkState('config.editor-indent-size')}>
                <option value='2'>2</option>
                <option value='4'>4</option>
                <option value='8'>8</option>
              </select>
            </div>
          </div>
          <div className='sectionTitle'>Preview</div>
          <div className='sectionInput'>
            <label>Preview Font Size</label>
            <input valueLink={this.linkState('config.preview-font-size')} onKeyDown={(e) => this.handleConfigKeyDown(e)} type='text'/>
          </div>
          <div className='sectionInput'>
            <label>Preview Font Family</label>
            <input valueLink={this.linkState('config.preview-font-family')} onKeyDown={(e) => this.handleConfigKeyDown(e)} type='text'/>
          </div>
          <div className='sectionSelect'>
            <label>Switching Preview</label>
            <select valueLink={this.linkState('config.switch-preview')}>
              <option value='blur'>When Editor Blurred</option>
              <option value='rightclick'>When Right Clicking</option>
            </select>
          </div>
          <div className='sectionCheck'>
            <label><input onChange={e => this.handleLineNumberingClick(e)} checked={this.state.config['preview-line-number']} type='checkbox'/>Code block line numbering</label>
          </div>
          {
            global.process.platform === 'win32'
            ? (
              <div className='sectionCheck'>
                <label><input onChange={e => this.handleDisableDirectWriteClick(e)} checked={this.state.config['disable-direct-write']} disabled={OSX} type='checkbox'/>Disable Direct Write<span className='sectionCheck-warn'>It will be applied after restarting</span></label>
              </div>
            )
            : null
          }
          <div className='sectionTitle'>Theme</div>
          <div className='sectionSelect'>
            <label>UI Theme</label>
            <select valueLink={this.linkState('config.theme-ui')}>
              <option value='light'>Light</option>
              <option value='dark'>Dark</option>
            </select>
          </div>
          <div className='sectionSelect'>
            <label>Code block Theme</label>
            <select valueLink={this.linkState('config.theme-code')}>
              {
                hljsThemeList.map((theme) => {
                  return (<option value={theme.name} key={theme.name}>{theme.caption}</option>)
                })
              }
            </select>
          </div>
          <div className='sectionSelect'>
            <label>Editor Theme</label>
            <select valueLink={this.linkState('config.theme-syntax')}>
              {
                aceThemeList.themes.map((theme) => {
                  return (<option value={theme.name} key={theme.name}>{theme.caption}</option>)
                })
              }
            </select>
          </div>
          <div className='sectionConfirm'>
            <button onClick={(e) => this.handleConfigSaveButtonClick(e)}>Save</button>
          </div>
        </div>
        <div className='section'>
          <div className='sectionTitle'>Hotkey</div>
          <div className='sectionInput'>
            <label>Toggle Main</label>
            <input onKeyDown={(e) => this.handleKeyDown(e)} valueLink={this.linkState('keymap.toggleMain')} type='text'/>
          </div>
          <div className='sectionInput'>
            <label>Toggle Finder(popup)</label>
            <input onKeyDown={(e) => this.handleKeyDown(e)} valueLink={this.linkState('keymap.toggleFinder')} type='text'/>
          </div>
          <div className='sectionConfirm'>
            <button onClick={(e) => this.handleSaveButtonClick(e)}>Save</button>
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

AppSettingTab.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string
  }),
  dispatch: PropTypes.func
}
