import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './MarkdownEditor.styl'
import CodeEditor from 'browser/components/CodeEditor'
import MarkdownPreview from 'browser/components/MarkdownPreview'

class MarkdownEditor extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      status: 'CODE'
    }
  }

  componentDidMount () {
    this.value = this.refs.code.value
  }

  componentDidUpdate () {
    this.value = this.refs.code.value
  }

  handleChange (e) {
    this.value = this.refs.code.value
    this.props.onChange(e)
  }

  handleContextMenu (e) {
    let { config } = this.props
    if (config.editor.switchPreview === 'RIGHTCLICK') {
      let newStatus = this.state.status === 'PREVIEW'
        ? 'CODE'
        : 'PREVIEW'
      this.setState({
        status: newStatus
      }, () => {
        if (newStatus === 'CODE') {
          this.refs.code.focus()
        } else {
          this.refs.code.blur()
          this.refs.preview.focus()
        }
      })
    }
  }

  focus () {
    if (this.state.status === 'PREVIEW') {
      this.setState({
        status: 'CODE'
      }, () => {
        this.refs.code.focus()
      })
    } else {
      this.refs.code.focus()
    }
  }

  reload () {
    this.refs.code.reload()
  }

  render () {
    let { className, value, config } = this.props
    let editorFontSize = parseInt(config.editor.fontSize, 10)
    if (!(editorFontSize > 0 && editorFontSize < 101)) editorFontSize = 14
    let editorIndentSize = parseInt(config.editor.indentSize, 10)
    if (!(editorFontSize > 0 && editorFontSize < 132)) editorIndentSize = 4

    let previewStyle = {}
    if (this.props.ignorePreviewPointerEvents) previewStyle.pointerEvents = 'none'

    return (
      <div className={className == null
          ? 'MarkdownEditor'
          : `MarkdownEditor ${className}`
        }
        onContextMenu={(e) => this.handleContextMenu(e)}
      >
        <CodeEditor styleName='codeEditor'
          ref='code'
          mode='markdown'
          value={value}
          theme={config.editor.theme}
          fontFamily={config.editor.fontFamily}
          fontSize={editorFontSize}
          indentType={config.editor.indentType}
          indentSize={editorIndentSize}
          onChange={(e) => this.handleChange(e)}
        />
        <MarkdownPreview styleName={this.state.status === 'PREVIEW'
            ? 'preview'
            : 'preview--hide'
          }
          style={previewStyle}
          fontSize={config.preview.fontSize}
          fontFamily={config.preview.fontFamily}
          codeBlockTheme={config.preview.theme}
          codeBlockFontFamily={config.editor.fontFamily}
          lineNumber={config.preview.lineNumber}
          ref='preview'
          onContextMenu={(e) => this.handleContextMenu(e)}
          tabIndex='0'
          value={value}
        />
      </div>
    )
  }
}

MarkdownEditor.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  ignorePreviewPointerEvents: PropTypes.bool
}

export default CSSModules(MarkdownEditor, styles)
