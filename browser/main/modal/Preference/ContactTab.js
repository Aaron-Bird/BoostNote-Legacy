import React from 'react'
import ReactDOM from 'react-dom'
import linkState from 'browser/lib/linkState'
import ExternalLink from 'browser/components/ExternalLink'

export default class ContactTab extends React.Component {
  componentDidMount () {
    let titleInput = ReactDOM.findDOMNode(this.refs.title)
    if (titleInput != null) titleInput.focus()
  }

  render () {
    return (
      <div className='ContactTab content'>
        <div className='title'>Contact</div>
        <p>
          - E-mail: <ExternalLink href='mailto:rokt33r@gmail.com?Subject=About%20Boost'>rokt33r@gmail.com</ExternalLink>
        </p>
        <p>
          - Issues: <ExternalLink href='https://github.com/BoostIO/Boostnote/issues'>https://github.com/BoostIO/Boostnote/issues</ExternalLink>
        </p>
      </div>
    )
  }
}

ContactTab.prototype.linkState = linkState
