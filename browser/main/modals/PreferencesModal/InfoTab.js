import React from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './InfoTab.styl'

const electron = require('electron')
const { shell, remote } = electron
const appVersion = remote.app.getVersion()

class InfoTab extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
  }

  handleLinkClick (e) {
    shell.openExternal(e.currentTarget.href)
    e.preventDefault()
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='header'>Info</div>

        <div styleName='top'>
          <div styleName='icon-space'>
            <img styleName='icon' src='../resources/app.png' width='92' height='92' />
            <div styleName='icon-right'>
              <div styleName='appId'>Boostnote {appVersion}</div>
              <div styleName='description'>
                An open source note-taking app made for programmers just like you.
              </div>
            </div>
          </div>
          <div styleName='clear' />
          <div styleName='madeBy'>Made by&nbsp;
            <a href='http://maisin.co/'
              onClick={(e) => this.handleLinkClick(e)}
            >MAISIN&CO.</a></div>
          <div styleName='copyright'>© 2017 MAISIN&CO.</div>
        </div>
        <ul styleName='list'>
          <li>
            The codes of this app is published under GPLv3 license.
          </li>
          <li>
            Let us hear your feedback🙌
          </li>
          <li>
            GitHub Issue : <a href='https://github.com/BoostIO/Boostnote/issues'
              onClick={(e) => this.handleLinkClick(e)}
            >https://github.com/BoostIO/Boostnote/issues</a>
          </li>
        </ul>
      </div>
    )
  }
}

InfoTab.propTypes = {
}

export default CSSModules(InfoTab, styles)
