var ipc = require('ipc')
var remote = require('remote')

var React = require('react')

var LinkedState = require('../Mixins/LinkedState')
var ExternalLink = require('../Mixins/ExternalLink')
var KeyCaster = require('../Mixins/KeyCaster')

module.exports = React.createClass({
  mixins: [LinkedState, ExternalLink, KeyCaster('aboutModal')],
  propTypes: {
    close: React.PropTypes.func
  },
  getInitialState: function () {
    var keymap = remote.getGlobal('keymap')
    console.log(keymap)
    return {
      currentTab: 'settings',
      keymap: keymap
    }
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'closeModal':
        this.props.close()
        break
    }
  },
  activeSettings: function () {
    this.setState({currentTab: 'settings'})
  },
  activeAbout: function () {
    this.setState({currentTab: 'about'})
  },
  saveKeymap: function () {
    ipc.send('hotkeyUpdated', JSON.stringify(this.state.keymap))
  },
  render: function () {
    var content = this.state.currentTab === 'settings' ? this.renderSettingsTab() : this.renderAboutTab()

    return (
      <div className='PreferencesModal sideNavModal modal'>
        <div className='leftPane'>
          <h1 className='modalLabel'>Preferences</h1>
          <nav className='tabList'>
            <button onClick={this.activeSettings} className={this.state.currentTab === 'settings' ? 'active' : ''}><i className='fa fa-gear fa-fw'/> Settings</button>
            <button onClick={this.activeAbout} className={this.state.currentTab === 'about' ? 'active' : ''}><i className='fa fa-info-circle fa-fw'/> About this app</button>
          </nav>
        </div>
        <div className='rightPane'>
          {content}
        </div>
      </div>
    )
  },
  renderSettingsTab: function () {
    return (
      <div className='settingsTab tab'>
        <div className='categoryLabel'>Hotkey</div>
        <div className='formField'>
          <label>Toggle finder</label>
          <input valueLink={this.linkState('keymap.toggleFinder')}/>
        </div>
        <div className='formConfirm'>
          <button onClick={this.saveKeymap}>Save</button>
        </div>
        <div className='example'>
          <h3>Example</h3>
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
    )
  },
  renderAboutTab: function () {
    var version = global.version
    return (
      <div className='aboutTab tab'>
        <div className='about1'>
          <img className='logo' src='resources/favicon-230x230.png'/>
          <div className='appInfo'>Boost {version == null || version.length === 0 ? 'DEV version' : 'v' + version}</div>
        </div>

        <div className='about2'>
          <div className='externalLabel'>External links</div>
          <ul className='externalList'>
            <li><a onClick={this.openExternal} href='http://b00st.io'>Boost Homepage <i className='fa fa-external-link'/></a></li>
            <li><a onClick={this.openExternal} href='http://boostio.github.io/regulations.html'>Regulation <i className='fa fa-external-link'/></a></li>
            <li><a onClick={this.openExternal} href='http://boostio.github.io/privacypolicies.html'>Private policy <i className='fa fa-external-link'/></a></li>
          </ul>
        </div>
      </div>
    )
  }
})
