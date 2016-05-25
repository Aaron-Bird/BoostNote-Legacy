import React, { PropTypes } from 'react'
import markdown from 'browser/lib/markdown'

const markdownStyle = require('!!css!stylus?sourceMap!./markdown.styl')[0][1]
const { shell } = require('electron')
const goExternal = function (e) {
  e.preventDefault()
  shell.openExternal(e.target.href)
}

export default class MarkdownPreview extends React.Component {
  constructor (props) {
    super(props)

    this.contextMenuHandler = (e) => this.handleContextMenu(e)
  }

  handleContextMenu (e) {
    this.props.onContextMenu(e)
  }

  componentDidMount () {
    this.refs.root.setAttribute('sandbox', 'allow-same-origin')
    this.refs.root.contentWindow.document.body.addEventListener('contextmenu', this.contextMenuHandler)
    this.rewriteIframe()
  }

  componentWillUnmount () {
    this.refs.root.contentWindow.document.body.removeEventListener('contextmenu', this.contextMenuHandler)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.value !== this.props.value) this.rewriteIframe()
  }

  rewriteIframe () {
    Array.prototype.forEach.call(this.refs.root.contentWindow.document.querySelectorAll('a'), (el) => {
      el.removeEventListener('click', goExternal)
    })

    let { value } = this.props
    this.refs.root.contentWindow.document.head.innerHTML = `
      <style>
        @font-face {
          font-family: 'Lato';
          src: url('../resources/fonts/Lato-Regular.woff2') format('woff2'), /* Modern Browsers */
               url('../resources/fonts/Lato-Regular.woff') format('woff'), /* Modern Browsers */
               url('../resources/fonts/Lato-Regular.ttf') format('truetype');
          font-style: normal;
          font-weight: normal;
          text-rendering: optimizeLegibility;
        }
        ${markdownStyle}
      </style>
      <link rel="stylesheet" href="../node_modules/highlight.js/styles/xcode.css" id="hljs-css">
      <link rel="stylesheet" href="../resources/katex.min.css">
    `
    this.refs.root.contentWindow.document.body.innerHTML = markdown(value)

    Array.prototype.forEach.call(this.refs.root.contentWindow.document.querySelectorAll('a'), (el) => {
      el.addEventListener('click', goExternal)
    })
  }

  focus () {
    this.refs.root.focus()
  }

  render () {
    let { className, style, tabIndex } = this.props
    return (
      <iframe className={className != null
          ? 'MarkdownPreview ' + className
          : 'MarkdownPreview'
        }
        style={style}
        tabIndex={tabIndex}
        ref='root'
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
  value: PropTypes.string
}
