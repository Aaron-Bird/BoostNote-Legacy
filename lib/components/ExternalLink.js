import React, { PropTypes } from 'react'
import shell from 'shell'

export default class ExternalLink extends React.Component {
  handleClick (e) {
    shell.openExternal(this.props.href)
    e.preventDefault()
  }

  render () {
    return (
      <a onClick={e => this.handleClick(e)} {...this.props}/>
    )
  }
}

ExternalLink.propTypes = {
  href: PropTypes.string
}
