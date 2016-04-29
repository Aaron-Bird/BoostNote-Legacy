import React, { PropTypes } from 'react'
import markdown from '../lib/markdown'
import ReactDOM from 'react-dom'
import sanitizeHtml from '@rokt33r/sanitize-html'
import _ from 'lodash'
import fetchConfig from '../lib/fetchConfig'

const electron = require('electron')
const shell = electron.shell
const ipc = electron.ipcRenderer

const katex = window.katex

const OSX = global.process.platform === 'darwin'

const sanitizeOpts = {
  allowedTags: [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
  'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'img', 'span', 'cite', 'del', 'u', 'sub', 'sup', 's', 'input', 'label' ],
  allowedClasses: {
    'a': ['lineAnchor'],
    'div': ['math'],
    'pre': ['hljs'],
    'span': ['math', 'hljs-*'],
    'code': ['language-*']
  },
  allowedAttributes: {
    a: ['href', 'data-key'],
    img: [ 'src' ],
    label: ['for'],
    input: ['checked', 'type'],
    '*': ['id', 'name']
  },
  transformTags: {
    '*': function (tagName, attribs) {
      let href = attribs.href
      if (tagName === 'input' && attribs.type !== 'checkbox') {
        return false
      }
      if (_.isString(href) && href.match(/^#.+$/)) attribs.href = href.replace(/^#/, '#md-anchor-')
      if (attribs.id) attribs.id = 'md-anchor-' + attribs.id
      if (attribs.name) attribs.name = 'md-anchor-' + attribs.name
      if (attribs.for) attribs.for = 'md-anchor-' + attribs.for
      return {
        tagName: tagName,
        attribs: attribs
      }
    }
  }
}

function handleAnchorClick (e) {
  if (this.attributes.href && this.attributes.href.nodeValue.match(/^#.+/)) {
    return
  }
  e.preventDefault()
  e.stopPropagation()
  let href = this.href
  if (href && href.match(/^http:\/\/|https:\/\/|mailto:\/\//)) {
    shell.openExternal(href)
  }
}

function stopPropagation (e) {
  e.preventDefault()
  e.stopPropagation()
}

function math2Katex (display) {
  return function (el) {
    try {
      katex.render(el.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'), el, {display: display})
      el.className = 'math-rendered'
    } catch (e) {
      el.innerHTML = e.message
      el.className = 'math-failed'
    }
  }
}

let config = fetchConfig()
ipc.on('config-apply', function (e, newConfig) {
  config = newConfig
})

export default class MarkdownPreview extends React.Component {
  constructor (props) {
    super(props)

    this.configApplyHandler = (e, config) => this.handleConfigApply(e, config)

    this.state = {
      fontSize: config['preview-font-size'],
      fontFamily: config['preview-font-family']
    }
  }
  componentDidMount () {
    this.addListener()
    this.renderMath()
    ipc.on('config-apply', this.configApplyHandler)
  }

  componentDidUpdate () {
    this.addListener()
    this.renderMath()
  }

  componentWillUnmount () {
    this.removeListener()
    ipc.removeListener('config-apply', this.configApplyHandler)
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
    var inputs = ReactDOM.findDOMNode(this).querySelectorAll('input')

    Array.prototype.forEach.call(anchors, anchor => {
      anchor.addEventListener('click', handleAnchorClick)
      anchor.addEventListener('mousedown', stopPropagation)
      anchor.addEventListener('mouseup', stopPropagation)
    })
    Array.prototype.forEach.call(inputs, input => {
      input.addEventListener('click', stopPropagation)
    })
  }

  removeListener () {
    var anchors = ReactDOM.findDOMNode(this).querySelectorAll('a:not(.lineAnchor)')
    var inputs = ReactDOM.findDOMNode(this).querySelectorAll('input')

    Array.prototype.forEach.call(anchors, anchor => {
      anchor.removeEventListener('click', handleAnchorClick)
      anchor.removeEventListener('mousedown', stopPropagation)
      anchor.removeEventListener('mouseup', stopPropagation)
    })
    Array.prototype.forEach.call(inputs, input => {
      input.removeEventListener('click', stopPropagation)
    })
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

  handleConfigApply (e, config) {
    this.setState({
      fontSize: config['preview-font-size'],
      fontFamily: config['preview-font-family']
    })
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
        style={{
          fontSize: this.state.fontSize,
          fontFamily: this.state.fontFamily.trim() + (OSX ? '' : ', meiryo, \'Microsoft YaHei\'') + ', helvetica, arial, sans-serif'
        }}
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
