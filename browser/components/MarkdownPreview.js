var React = require('react')
var { PropTypes } = React
import markdown from '../lib/markdown'
var ReactDOM = require('react-dom')

const electron = require('electron')
const shell = electron.shell

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
    var anchors = ReactDOM.findDOMNode(this).querySelectorAll('a')

    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', handleAnchorClick)
    }
  }

  removeListener () {
    var anchors = ReactDOM.findDOMNode(this).querySelectorAll('a')

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
