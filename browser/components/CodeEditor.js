import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import modes from '../lib/modes'
import _ from 'lodash'
import fetchConfig from '../lib/fetchConfig'

const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer

const ace = window.ace

let config = fetchConfig()
ipc.on('config-apply', function (e, newConfig) {
  config = newConfig
})

export default class CodeEditor extends React.Component {
  constructor (props) {
    super(props)

    this.configApplyHandler = (e, config) => this.handleConfigApply(e, config)
    this.changeHandler = e => this.handleChange(e)
    this.blurHandler = (e) => {
      if (e.relatedTarget === null) {
        return
      }

      let isFocusingToSearch = e.relatedTarget.className && e.relatedTarget.className.split(' ').some(clss => {
        return clss === 'ace_search_field' || clss === 'ace_searchbtn' || clss === 'ace_replacebtn' || clss === 'ace_searchbtn_close' || clss === 'ace_text-input'
      })
      if (isFocusingToSearch) {
        return
      }

      if (this.props.onBlur) this.props.onBlur(e)
    }

    this.killedBuffer = ''
    this.execHandler = (e) => {
      console.log(e.command.name)
      switch (e.command.name) {
        case 'gotolineend':
          e.preventDefault()
          let position = this.editor.getCursorPosition()
          this.editor.navigateTo(position.row, this.editor.getSession().getLine(position.row).length)
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
          Array.prototype.forEach.call(ReactDOM.findDOMNode(this).querySelectorAll('.ace_search_field, .ace_searchbtn, .ace_replacebtn, .ace_searchbtn_close'), el => {
            el.removeEventListener('blur', this.blurHandler)
            el.addEventListener('blur', this.blurHandler)
          })
          break
      }
    }

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
      name: 'Emacs cursor up',
      bindKey: {mac: 'Ctrl-Y'},
      exec: function (editor) {
        editor.insert(this.killedBuffer)
      }.bind(this),
      readOnly: true
    })
    editor.commands.addCommand({
      name: 'Focus title',
      bindKey: {win: 'Esc', mac: 'Esc'},
      exec: function (editor, e) {
        let currentWindow = remote.getCurrentWebContents()
        if (config['switch-preview'] === 'rightclick') {
          currentWindow.send('detail-preview')
        }
        currentWindow.send('list-focus')
      },
      readOnly: true
    })

    editor.commands.on('exec', this.execHandler)
    editor.commands.on('afterExec', this.afterExecHandler)

    var session = editor.getSession()
    let mode = _.findWhere(modes, {name: article.mode})
    let syntaxMode = mode != null
      ? mode.mode
      : 'text'
    session.setMode('ace/mode/' + syntaxMode)

    session.setUseSoftTabs(this.state.indentType === 'space')
    session.setTabSize(!isNaN(this.state.indentSize) ? parseInt(this.state.indentSize, 10) : 4)
    session.setOption('useWorker', false)
    session.setUseWrapMode(true)
    session.setValue(this.props.article.content)

    session.on('change', this.changeHandler)

    ipc.on('config-apply', this.configApplyHandler)
  }

  componentWillUnmount () {
    ipc.removeListener('config-apply', this.configApplyHandler)
    this.editor.getSession().removeListener('change', this.changeHandler)
    this.editor.removeListener('blur', this.blurHandler)
    this.editor.commands.removeListener('exec', this.execHandler)
    this.editor.commands.removeListener('afterExec', this.afterExecHandler)
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

  handleConfigApply (e, config) {
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
          fontFamily: this.state.fontFamily.trim() + ', monospace'
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
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool
}

CodeEditor.defaultProps = {
  readOnly: false
}

export default CodeEditor
