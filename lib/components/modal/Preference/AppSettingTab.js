import React, { PropTypes } from 'react'

export default class AppSettingTab extends React.Component {
  render () {
    return (
      <div className='AppSettingTab content'>
        <div className='section'>
          <div className='sectionTitle'>Hotkey</div>
          <div className='sectionInput'>
            <label>Toggle Finder(popup)</label>
            <input type='text'/>
          </div>
          <div className='sectionConfirm'>
            <button>Save</button>
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
