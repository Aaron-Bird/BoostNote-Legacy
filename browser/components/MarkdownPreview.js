import React, { PropTypes } from 'react'
import markdown from 'browser/lib/markdown'
import _ from 'lodash'

const markdownStyle = require('!!css!stylus?sourceMap!./markdown.styl')[0][1]
const { shell } = require('electron')
const goExternal = function (e) {
  e.preventDefault()
  shell.openExternal(e.target.href)
}

const OSX = global.process.platform === 'darwin'

const defaultFontFamily = ['helvetica', 'arial', 'sans-serif']
if (!OSX) {
  defaultFontFamily.unshift('\'Microsoft YaHei\'')
  defaultFontFamily.unshift('meiryo')
}
const defaultCodeBlockFontFamily = ['Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'monospace']

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
    if (prevProps.value !== this.props.value ||
      prevProps.fontFamily !== this.props.fontFamily ||
      prevProps.fontSize !== this.props.fontSize ||
      prevProps.codeBlockFontFamily !== this.props.codeBlockFontFamily ||
      prevProps.lineNumber !== this.props.lineNumber
    ) this.rewriteIframe()
  }

  rewriteIframe () {
    Array.prototype.forEach.call(this.refs.root.contentWindow.document.querySelectorAll('a'), (el) => {
      el.removeEventListener('click', goExternal)
    })

    let { value, fontFamily, fontSize, codeBlockFontFamily, lineNumber } = this.props
    fontFamily = _.isString(fontFamily) && fontFamily.trim().length > 0
      ? [fontFamily].concat(defaultFontFamily)
      : defaultFontFamily
    codeBlockFontFamily = _.isString(codeBlockFontFamily) && codeBlockFontFamily.trim().length > 0
      ? [codeBlockFontFamily].concat(defaultCodeBlockFontFamily)
      : defaultCodeBlockFontFamily

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
        body {
          font-family: ${fontFamily.join(', ')};
          font-size: ${fontSize}px;
        }
        code {
          font-family: ${codeBlockFontFamily.join(', ')};
        }
        .lineNumber {
          ${lineNumber && 'display: block !important;'}
          font-family: ${codeBlockFontFamily.join(', ')};
          opacity: 0.5;
        }
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
