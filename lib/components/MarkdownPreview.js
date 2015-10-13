import shell from 'shell'
import React, { PropTypes } from 'react'
import markdown from 'boost/markdown'

function handleAnchorClick (e) {
  shell.openExternal(e.target.href)
  e.preventDefault()
}

export default class MarkdownPreview extends React.Component {
  componentDidMount () {
    this.addListener()
  }

  componentDidUpdate () {
    this.addListener()
  }

  componentWillUnmount () {
    this.removeListener()
  }

  componentWillUpdate () {
    this.removeListener()
  }

  addListener () {
    var anchors = React.findDOMNode(this).querySelectorAll('a')

    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', handleAnchorClick)
    }
  }

  removeListener () {
    var anchors = React.findDOMNode(this).querySelectorAll('a')

    for (var i = 0; i < anchors.length; i++) {
      anchors[i].removeEventListener('click', handleAnchorClick)
    }
  }

  render () {
    return (
      <div className={'MarkdownPreview' + (this.props.className != null ? ' ' + this.props.className : '')} dangerouslySetInnerHTML={{__html: ' ' + markdown(this.props.content)}}/>
    )
  }
}

MarkdownPreview.propTypes = {
  className: PropTypes.string,
  content: PropTypes.string
}
