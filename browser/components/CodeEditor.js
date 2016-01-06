import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import modes from '../lib/modes'
import _ from 'lodash'

const remote = require('electron').remote
const ace = window.ace

export default class CodeEditor extends React.Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.readOnly !== this.props.readOnly) {
      this.editor.setReadOnly(!!nextProps.readOnly)
    }
  }

  componentDidMount () {
    var el = ReactDOM.findDOMNode(this)
    var editor = this.editor = ace.edit(el)
    editor.$blockScrolling = Infinity
    editor.renderer.setShowGutter(true)
    editor.setTheme('ace/theme/xcode')
    editor.moveCursorTo(0, 0)
    editor.setReadOnly(!!this.props.readOnly)

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
      name: 'Focus title',
      bindKey: {win: 'Esc', mac: 'Esc'},
      exec: function (editor, e) {
        remote.getCurrentWebContents().send('list-focus')
      },
      readOnly: true
    })

    editor.on('blur', () => {
      if (this.props.onBlur) this.props.onBlur()
    })

    var session = editor.getSession()
    let mode = _.findWhere(modes, {name: this.props.mode})
    let syntaxMode = mode != null
      ? mode.mode
      : 'text'
    session.setMode('ace/mode/' + syntaxMode)

    session.setUseSoftTabs(true)
    session.setOption('useWorker', false)
    session.setUseWrapMode(true)
    session.setValue(this.props.code)

    session.on('change', e => {
      if (this.props.onChange != null) {
        var value = editor.getValue()
        this.props.onChange(e, value)
      }
    })
  }

  componentDidUpdate (prevProps) {
    var session = this.editor.getSession()
    if (this.editor.getValue() !== this.props.code) {
      session.setValue(this.props.code)
    }
    if (prevProps.mode !== this.props.mode) {
      let mode = _.findWhere(modes, {name: this.props.mode})
      let syntaxMode = mode != null
        ? mode.mode
        : 'text'
      session.setMode('ace/mode/' + syntaxMode)
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

  render () {
    return (
      <div className={this.props.className == null ? 'CodeEditor' : 'CodeEditor ' + this.props.className}></div>
    )
  }
}

CodeEditor.propTypes = {
  code: PropTypes.string,
  mode: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  readOnly: PropTypes.bool
}

CodeEditor.defaultProps = {
  readOnly: false
}

export default CodeEditor
