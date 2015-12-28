import React from 'react'
import ReactDOM from 'react-dom'
import modes from '../lib/modes'
import _ from 'lodash'

const remote = require('electron').remote
const ace = window.ace

module.exports = React.createClass({
  propTypes: {
    code: React.PropTypes.string,
    mode: React.PropTypes.string,
    className: React.PropTypes.string,
    onChange: React.PropTypes.func,
    readOnly: React.PropTypes.bool
  },
  getDefaultProps: function () {
    return {
      readOnly: false
    }
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.readOnly !== this.props.readOnly) {
      this.editor.setReadOnly(!!nextProps.readOnly)
    }
  },
  componentDidMount: function () {
    var el = ReactDOM.findDOMNode(this.refs.target)
    var editor = this.editor = ace.edit(el)
    editor.$blockScrolling = Infinity
    editor.setValue(this.props.code)
    editor.renderer.setShowGutter(true)
    editor.setTheme('ace/theme/xcode')
    editor.clearSelection()
    editor.moveCursorTo(0, 0)
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
        console.log(e)
        remote.getCurrentWebContents().send('detail-edit')
      },
      readOnly: true
    })

    editor.setReadOnly(!!this.props.readOnly)

    var session = editor.getSession()
    let mode = _.findWhere(modes, {name: this.props.mode})
    let syntaxMode = mode != null
      ? mode.mode
      : 'text'
    session.setMode('ace/mode/' + syntaxMode)

    session.setUseSoftTabs(true)
    session.setOption('useWorker', false)
    session.setUseWrapMode(true)

    session.on('change', function (e) {
      if (this.props.onChange != null) {
        var value = editor.getValue()
        this.props.onChange(e, value)
      }
    }.bind(this))
  },
  componentDidUpdate: function (prevProps) {
    if (this.editor.getValue() !== this.props.code) {
      this.editor.setValue(this.props.code)
      this.editor.clearSelection()
    }
    if (prevProps.mode !== this.props.mode) {
      var session = this.editor.getSession()
      let mode = _.findWhere(modes, {name: this.props.mode})
      let syntaxMode = mode != null
        ? mode.mode
        : 'text'
      session.setMode('ace/mode/' + syntaxMode)
    }
  },
  getFirstVisibleRow: function () {
    return this.editor.getFirstVisibleRow()
  },
  getCursorPosition: function () {
    return this.editor.getCursorPosition()
  },
  moveCursorTo: function (row, col) {
    this.editor.moveCursorTo(row, col)
  },
  scrollToLine: function (num) {
    this.editor.scrollToLine(num, false, false)
  },
  render: function () {
    return (
      <div ref='target' className={this.props.className == null ? 'CodeEditor' : 'CodeEditor ' + this.props.className}></div>
    )
  }
})
