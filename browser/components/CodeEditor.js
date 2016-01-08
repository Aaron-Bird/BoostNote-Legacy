import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import modes from '../lib/modes'
import _ from 'lodash'

const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer

const ace = window.ace

function getConfig () {
  return Object.assign({}, remote.getGlobal('config'))
}

let config = getConfig()

export default class CodeEditor extends React.Component {
  constructor (props) {
    super(props)

    this.configApplyHandler = e => this.handleConfigApply(e)
    this.changeHandler = e => this.handleChange(e)

    this.state = {
      fontSize: config['editor-font-size'],
      fontFamily: config['editor-font-family'],
      indentType: config['editor-indent-type'],
      indentSize: config['editor-indent-size']
    }

    this.silentChange = false
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.readOnly !== this.props.readOnly) {
      this.editor.setReadOnly(!!nextProps.readOnly)
    }
  }

  componentDidMount () {
    let { article } = this.props
    var el = ReactDOM.findDOMNode(this)
    var editor = this.editor = ace.edit(el)
    editor.$blockScrolling = Infinity
    editor.renderer.setShowGutter(true)
    editor.setTheme('ace/theme/xcode')
    editor.moveCursorTo(0, 0)
    editor.setReadOnly(!!this.props.readOnly)
    editor.setFontSize(this.state.fontSize)

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
    let mode = _.findWhere(modes, {name: article.mode})
    let syntaxMode = mode != null
      ? mode.mode
      : 'text'
    session.setMode('ace/mode/' + syntaxMode)

    session.setUseSoftTabs(this.state.indentType === 'space')
    session.setTabSize(!isNaN(this.state.indentSize) ? parseInt(this.state.indentSize, 10) : 4)
    session.setOption('useWorker', true)
    session.setUseWrapMode(true)
    session.setValue(this.props.article.content)

    session.on('change', this.changeHandler)

    ipc.on('config-apply', this.configApplyHandler)
  }

  componentWillUnmount () {
    ipc.removeListener('config-apply', this.configApplyHandler)
    this.editor.getSession().removeListener('change', this.changeHandler)
  }

  componentDidUpdate (prevProps, prevState) {
    var session = this.editor.getSession()
    if (this.props.article.key !== prevProps.article.key) {
      session.removeListener('change', this.changeHandler)
      session.setValue(this.props.article.content)
      session.getUndoManager().reset()
      session.on('change', this.changeHandler)
    }
    if (prevProps.article.mode !== this.props.article.mode) {
      let mode = _.findWhere(modes, {name: this.props.article.mode})
      let syntaxMode = mode != null
        ? mode.mode
        : 'text'
      session.setMode('ace/mode/' + syntaxMode)
    }
  }

  handleConfigApply () {
    config = getConfig()
    this.setState({
      fontSize: config['editor-font-size'],
      fontFamily: config['editor-font-family'],
      indentType: config['editor-indent-type'],
      indentSize: config['editor-indent-size']
    }, function () {
      var session = this.editor.getSession()
      session.setUseSoftTabs(this.state.indentType === 'space')
      session.setTabSize(!isNaN(this.state.indentSize) ? parseInt(this.state.indentSize, 10) : 4)
    })
  }
  handleChange (e) {
    if (this.props.onChange) {
      var value = this.editor.getValue()
      this.props.onChange(value)
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
      <div
        className={this.props.className == null ? 'CodeEditor' : 'CodeEditor ' + this.props.className}
        style={{
          fontSize: this.state.fontSize,
          fontFamily: this.state.fontFamily
        }}
      />
    )
  }
}

CodeEditor.propTypes = {
  article: PropTypes.shape({
    content: PropTypes.string,
    mode: PropTypes.string,
    key: PropTypes.string
  }),
  className: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  readOnly: PropTypes.bool
}

CodeEditor.defaultProps = {
  readOnly: false
}

export default CodeEditor
