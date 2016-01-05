import React, { PropTypes } from 'react'
import markdown from '../lib/markdown'
import ReactDOM from 'react-dom'
import sanitizeHtml from '@rokt33r/sanitize-html'
import hljs from 'highlight.js'

const electron = require('electron')
const shell = electron.shell

const katex = window.katex

const sanitizeOpts = {
  allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
  'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'span', 'cite', 'del', 'u' ],
  allowedClasses: {
    'a': ['lineAnchor'],
    'div': ['math'],
    'span': ['math', 'hljs-*'],
    'code': ['language-*']
  },
  allowedAttributes: {
    a: ['href', 'data-key'],
    img: [ 'src' ]
  }
}

function handleAnchorClick (e) {
  e.preventDefault()
  e.stopPropagation()
  console.log(e.target.href)
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
    // this.renderCode()
    this.renderMath()
  }

  componentDidUpdate () {
    this.addListener()
    // this.renderCode()
    this.renderMath()
  }

  componentWillUnmount () {
    this.removeListener()
  }

  componentWillUpdate () {
    this.removeListener()
  }

  renderCode () {
    let codes = ReactDOM.findDOMNode(this).querySelectorAll('code:not(.rendered)')
    Array.prototype.forEach.call(codes, el => {
      let matched = el.className.match(/language-(.+)/)
      let lang = matched ? matched[1] : null
      try {
        let result = hljs.highlight(lang, el.innerHTML)
        el.innerHTML = result.value
        el.className += ' rendered'
      } catch (e) {
      }
    })
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
    content = markdown(content)
    content = sanitizeHtml(content, sanitizeOpts)

    return (
      <div
        className={'MarkdownPreview' + (this.props.className != null ? ' ' + this.props.className : '') + (isEmpty ? ' empty' : '')}
        onClick={e => this.handleClick(e)}
        onDoubleClick={e => this.handleDoubleClick(e)}
        onMouseDown={e => this.handleMouseDown(e)}
        onMouseMove={e => this.handleMouseMove(e)}
        onMouseUp={e => this.handleMouseUp(e)}
        dangerouslySetInnerHTML={{__html: ' ' + content}}
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
