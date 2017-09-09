import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './RealtimeNotification.styl'

const electron = require('electron')
const { shell } = electron

class RealtimeNotification extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      notifications: []
    }
  }

  componentDidMount () {
    this.fetchNotifications()
  }

  fetchNotifications () {
    fetch('https://raw.githubusercontent.com/asmsuechan/notification/master/notification.json')
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.setState({notifications: json.notifications})
      })
  }

  handleLinkClick (e) {
    shell.openExternal(e.currentTarget.href)
    e.preventDefault()
  }

  render () {
    const { notifications } = this.state
    const link = notifications.length > 0
      ? <a href={notifications[0].linkUrl}
        onClick={(e) => this.handleLinkClick(e)}
      >
        {notifications[0].text}
      </a>
    : ''

    return (
      <div>{link}</div>
    )
  }
}

RealtimeNotification.propTypes = {}

export default CSSModules(RealtimeNotification, styles)
