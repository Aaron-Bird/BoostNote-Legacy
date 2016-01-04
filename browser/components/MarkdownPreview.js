var React = require('react')
var { PropTypes } = React
import markdown from '../lib/markdown'
var ReactDOM = require('react-dom')

const electron = require('electron')
const shell = electron.shell

const katex = window.katex

function handleAnchorClick (e) {
  e.preventDefault()
  e.stopPropagation()
  shell.openExternal(e.target.href)
}

function stopPropagation (e) {
  e.preventDefault()
  e.stopPropagation()
}

function math2Katex (display) {
  return function (el) {
    try {
      katex.render(el.innerHTML, el, {display: display})
      el.className = 'math-rendered'
    } catch (e) {
      el.innerHTML = e.message
      el.className = 'math-failed'
    }
  }
}

export default class MarkdownPreview extends React.Component {
  componentDidMount () {
    this.addListener()
    this.renderMath()
  }

  componentDidUpdate () {
    this.addListener()
    this.renderMath()
  }

  componentWillUnmount () {
    this.removeListener()
  }

  componentWillUpdate () {
    this.removeListener()
  }

  renderMath () {
    let inline = ReactDOM.findDOMNode(this).querySelectorAll('span.math')
    Array.prototype.forEach.call(inline, math2Katex(false))
    let block = ReactDOM.findDOMNode(this).querySelectorAll('div.math')
    Array.prototype.forEach.call(block, math2Katex(true))
  }

  addListener () {
    var anchors = ReactDOM.findDOMNode(this).querySelectorAll('a:not(.lineAnchor)')

    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', handleAnchorClick)
      anchors[i].addEventListener('mousedown', stopPropagation)
      anchors[i].addEventListener('mouseup', stopPropagation)
    }
  }

  removeListener () {
    var anchors = ReactDOM.findDOMNode(this).querySelectorAll('a:not(.lineAnchor)')

    for (var i = 0; i < anchors.length; i++) {
      anchors[i].removeEventListener('click', handleAnchorClick)
      anchors[i].removeEventListener('mousedown', stopPropagation)
      anchors[i].removeEventListener('mouseup', stopPropagation)
    }
  }

  handleClick (e) {
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  handleDoubleClick (e) {
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick(e)
    }
  }

  handleMouseDown (e) {
    if (this.props.onMouseDown) {
      this.props.onMouseDown(e)
    }
  }

  handleMouseUp (e) {
    if (this.props.onMouseUp) {
      this.props.onMouseUp(e)
    }
  }

  handleMouseMove (e) {
    if (this.props.onMouseMove) {
      this.props.onMouseMove(e)
    }
  }

  render () {
    let isEmpty = this.props.content.trim().length === 0
    let content = isEmpty
      ? '(Empty content)'
      : this.props.content
    return (
      <div
        className={'MarkdownPreview' + (this.props.className != null ? ' ' + this.props.className : '') + (isEmpty ? ' empty' : '')}
        onClick={e => this.handleClick(e)}
        onDoubleClick={e => this.handleDoubleClick(e)}
        onMouseDown={e => this.handleMouseDown(e)}
        onMouseMove={e => this.handleMouseMove(e)}
        onMouseUp={e => this.handleMouseUp(e)}
        dangerouslySetInnerHTML={{__html: ' ' + markdown(content)}}
      />
    )
  }
}

MarkdownPreview.propTypes = {
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onMouseUp: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseMove: PropTypes.func,
  className: PropTypes.string,
  content: PropTypes.string
}
