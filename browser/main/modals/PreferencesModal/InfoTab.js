import React, { PropTypes } from 'react'
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
        <div styleName='top'>
          <img styleName='icon' src='../resources/app.png' width='150' height='150'/>
          <div styleName='appId'>Boostnote {appVersion}</div>
          <div styleName='madeBy'>Made by MAISIN&CO.</div>
        </div>
        <ul>
          <li>
            - License : GPLv3
          </li>
          <li>
            - Issue Tracker : <a href='https://github.com/BoostIO/Boostnote/issues'
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
