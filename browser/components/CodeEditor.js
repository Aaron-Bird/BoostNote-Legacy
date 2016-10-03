import React, { PropTypes } from 'react'
import _ from 'lodash'
import CodeMirror from 'codemirror'

CodeMirror.modeURL = '../node_modules/codemirror/mode/%N/%N.js'

const defaultEditorFontFamily = ['Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'monospace']

function pass (name) {
  switch (name) {
    case 'ejs':
      return 'Embedded Javascript'
    case 'html_ruby':
      return 'Embedded Ruby'
    case 'objectivec':
      return 'Objective C'
    case 'text':
      return 'Plain Text'
    default:
      return name
  }
}

export default class CodeEditor extends React.Component {
  constructor (props) {
    super(props)

    this.changeHandler = (e) => this.handleChange(e)
    this.blurHandler = (editor, e) => {
      if (e == null) return null
      let el = e.relatedTarget
      while (el != null) {
        if (el === this.refs.root) {
          return
        }
        el = el.parentNode
      }
      this.props.onBlur != null && this.props.onBlur(e)
    }
  }

  componentWillReceiveProps (nextProps) {
    // if (nextProps.readOnly !== this.props.readOnly) {
    //   this.editor.setReadOnly(!!nextProps.readOnly)
    // }
  }

  componentDidMount () {
    this.editor = CodeMirror(this.refs.root, {
      value: this.props.value,
      lineNumbers: true,
      lineWrapping: true,
      theme: this.props.theme
    })
    this.setMode(this.props.mode)
    this.editor.on('blur', this.blurHandler)
    this.editor.on('change', this.changeHandler)
    // editor.setTheme('ace/theme/' + theme)
    // editor.setReadOnly(!!this.props.readOnly)

    // this.editor.setTabSize(this.props.indentSize)
    // this.editor.setTabSize(this.props.indentSize)
    // session.setUseSoftTabs(this.props.indentType === 'space')
    // session.setTabSize(this.props.indentSize)
    // session.setUseWrapMode(true)
  }

  componentWillUnmount () {
    this.editor.off('blur', this.blurHandler)
    this.editor.off('change', this.changeHandler)
  }

  componentDidUpdate (prevProps, prevState) {
    let needRefresh = false
    if (prevProps.mode !== this.props.mode) {
      this.setMode(this.props.mode)
    }
    if (prevProps.theme !== this.props.theme) {
      this.editor.setOption('theme', this.props.theme)
      needRefresh = true
    }
    if (prevProps.fontSize !== this.props.fontSize) {
      needRefresh = true
    }
    if (prevProps.fontFamily !== this.props.fontFamily) {
      needRefresh = true
    }

    if (needRefresh) {
      this.editor.refresh()
    }
    // if (prevProps.indentSize !== this.props.indentSize) {
    //   session.setTabSize(this.props.indentSize)
    // }
    // if (prevProps.indentType !== this.props.indentType) {
    //   session.setUseSoftTabs(this.props.indentType === 'space')
    // }
  }

  setMode (mode) {
    let syntax = CodeMirror.findModeByName(pass(mode))
    if (syntax == null) syntax = CodeMirror.findModeByName('Plain Text')
    this.editor.setOption('mode', syntax.mode)
    CodeMirror.autoLoadMode(this.editor, syntax.mode)
  }

  handleChange (e) {
    if (this.props.onChange) {
      this.value = this.editor.getValue()
      this.props.onChange(e)
    }
  }

  moveCursorTo (row, col) {
  }

  scrollToLine (num) {
  }

  focus () {
    this.editor.focus()
  }

  blur () {
    this.editor.blur()
  }

  reload () {
    // Change event shouldn't be fired when switch note
    this.editor.off('change', this.changeHandler)
    this.editor.setValue(this.props.value)
    this.editor.clearHistory()
    this.editor.on('change', this.changeHandler)
  }

  setValue (value) {
    let cursor = this.editor.getCursor()
    this.editor.setValue(value)
    this.editor.setCursor(cursor)
  }

  render () {
    let { className, fontFamily, fontSize } = this.props
    fontFamily = _.isString(fontFamily) && fontFamily.length > 0
      ? [fontFamily].concat(defaultEditorFontFamily)
      : defaultEditorFontFamily
    return (
      <div
        className={className == null
          ? 'CodeEditor'
          : `CodeEditor ${className}`
        }
        ref='root'
        tabIndex='-1'
        style={{
          fontFamily: fontFamily.join(', '),
          fontSize: fontSize
        }}
      />
    )
  }
}

CodeEditor.propTypes = {
  value: PropTypes.string,
  mode: PropTypes.string,
  className: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool
}

CodeEditor.defaultProps = {
  readOnly: false,
  theme: 'xcode',
  fontSize: 14,
  fontFamily: 'Monaco, Consolas',
  indentSize: 4,
  indentType: 'space'
}
