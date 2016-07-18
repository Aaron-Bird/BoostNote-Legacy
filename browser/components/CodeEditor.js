import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import modes from '../lib/modes'
import _ from 'lodash'

const ace = window.ace

const defaultEditorFontFamily = ['Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', 'monospace']

export default class CodeEditor extends React.Component {
  constructor (props) {
    super(props)

    this.changeHandler = (e) => this.handleChange(e)
    this.blurHandler = (e) => {
      e.stopPropagation()
      let el = e.relatedTarget
      let isStillFocused = false
      while (el != null) {
        if (el === this.refs.root) {
          isStillFocused = true
          break
        }
        el = el.parentNode
      }
      console.log(isStillFocused)

      if (!isStillFocused && this.props.onBlur != null) this.props.onBlur(e)
    }

    this.killedBuffer = ''
    this.execHandler = (e) => {
      console.info('ACE COMMAND >> %s', e.command.name)
      switch (e.command.name) {
        case 'gotolinestart':
          e.preventDefault()
          {
            let position = this.editor.getCursorPosition()
            this.editor.navigateTo(position.row, 0)
          }
          break
        case 'gotolineend':
          e.preventDefault()
          let position = this.editor.getCursorPosition()
          this.editor.navigateTo(position.row, this.editor.getSession().getLine(position.row).length)
          break
        case 'jumptomatching':
          e.preventDefault()
          this.editor.navigateUp()
          break
        case 'removetolineend':
          e.preventDefault()
          let range = this.editor.getSelectionRange()
          let session = this.editor.getSession()
          if (range.isEmpty()) {
            range.setEnd(range.start.row, session.getLine(range.start.row).length)
            this.killedBuffer = session.getTextRange(range)
            if (this.killedBuffer.length > 0) {
              console.log('remove to lineend')
              session.remove(range)
            } else {
              if (session.getLength() === range.start.row) {
                return
              }
              range.setStart(range.start.row, range.end.col)
              range.setEnd(range.start.row + 1, 0)
              this.killedBuffer = '\n'
              session.remove(range)
            }
          } else {
            this.killedBuffer = session.getTextRange(range)
            session.remove(range)
          }
      }
    }
    this.afterExecHandler = (e) => {
      switch (e.command.name) {
        case 'find':
          Array.prototype.forEach.call(ReactDOM.findDOMNode(this).querySelectorAll('.ace_search_field, .ace_searchbtn, .ace_replacebtn, .ace_searchbtn_close'), (el) => {
            el.removeEventListener('blur', this.blurHandler)
            el.addEventListener('blur', this.blurHandler)
          })
          break
      }
    }

    this.state = {
    }

    this.silentChange = false
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.readOnly !== this.props.readOnly) {
      this.editor.setReadOnly(!!nextProps.readOnly)
    }
  }

  componentDidMount () {
    let { mode, value, theme, fontSize } = this.props
    this.value = value
    let el = ReactDOM.findDOMNode(this)
    let editor = this.editor = ace.edit(el)
    editor.$blockScrolling = Infinity
    editor.renderer.setShowGutter(true)
    editor.setTheme('ace/theme/' + theme)
    editor.moveCursorTo(0, 0)
    editor.setReadOnly(!!this.props.readOnly)
    editor.setFontSize(fontSize)

    editor.on('blur', this.blurHandler)

    editor.commands.addCommand({
      name: 'Emacs cursor up',
      bindKey: {mac: 'Ctrl-P'},
      exec: function (editor) {
        editor.navigateUp(1)
        if (editor.getCursorPosition().row < editor.getFirstVisibleRow()) editor.scrollToLine(editor.getCursorPosition().row, false, false)
      },
      readOnly: true
    })
    editor.commands.addCommand({
      name: 'Emacs kill buffer',
      bindKey: {mac: 'Ctrl-Y'},
      exec: function (editor) {
        editor.insert(this.killedBuffer)
      }.bind(this),
      readOnly: true
    })

    editor.commands.on('exec', this.execHandler)
    editor.commands.on('afterExec', this.afterExecHandler)

    var session = editor.getSession()
    mode = _.find(modes, {name: mode})
    let syntaxMode = mode != null
      ? mode.mode
      : 'text'
    session.setMode('ace/mode/' + syntaxMode)

    session.setUseSoftTabs(this.props.indentType === 'space')
    session.setTabSize(this.props.indentSize)
    session.setOption('useWorker', true)
    session.setUseWrapMode(true)
    session.setValue(_.isString(value) ? value : '')

    session.on('change', this.changeHandler)
  }

  componentWillUnmount () {
    this.editor.getSession().removeListener('change', this.changeHandler)
    this.editor.removeListener('blur', this.blurHandler)
    this.editor.commands.removeListener('exec', this.execHandler)
    this.editor.commands.removeListener('afterExec', this.afterExecHandler)
  }

  componentDidUpdate (prevProps, prevState) {
    let { value } = this.props
    this.value = value
    let editor = this.editor
    let session = this.editor.getSession()

    if (prevProps.mode !== this.props.mode) {
      let mode = _.find(modes, {name: this.props.mode})
      let syntaxMode = mode != null
        ? mode.mode
        : 'text'
      session.setMode('ace/mode' + syntaxMode)
    }
    if (prevProps.theme !== this.props.theme) {
      editor.setTheme('ace/theme/' + this.props.theme)
    }
    if (prevProps.fontSize !== this.props.fontSize) {
      editor.setFontSize(this.props.fontSize)
    }
    if (prevProps.indentSize !== this.props.indentSize) {
      session.setTabSize(this.props.indentSize)
    }
    if (prevProps.indentType !== this.props.indentType) {
      session.setUseSoftTabs(this.props.indentType === 'space')
    }
  }

  handleChange (e) {
    if (this.props.onChange) {
      this.value = this.editor.getValue()
      this.props.onChange(e)
    }
  }

  getFirstVisibleRow () {
    return this.editor.getFirstVisibleRow()
  }

  getCursorPosition () {
    return this.editor.getCursorPosition()
  }

  moveCursorTo (row, col) {
    this.editor.moveCursorTo(row, col)
  }

  scrollToLine (num) {
    this.editor.scrollToLine(num, false, false)
  }

  focus () {
    this.editor.focus()
  }

  blur () {
    this.editor.blur()
  }

  reload () {
    let session = this.editor.getSession()
    session.removeListener('change', this.changeHandler)
    session.setValue(this.props.value)
    session.getUndoManager().reset()
    session.on('change', this.changeHandler)
  }

  render () {
    let { className, fontFamily } = this.props
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
          fontFamily: fontFamily.join(', ')
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

export default CodeEditor
