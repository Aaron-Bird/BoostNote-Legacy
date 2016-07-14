import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './InfoTab.styl'

const appVersion = global.process.version

class InfoTab extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }
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
            - Issue Tracker : <a href='https://github.com/BoostIO/Boostnote/issues'>https://github.com/BoostIO/Boostnote/issues</a>
          </li>
        </ul>
      </div>
    )
  }
}

InfoTab.propTypes = {
}

export default CSSModules(InfoTab, styles)
