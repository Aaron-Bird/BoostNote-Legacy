import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import MarkdownPreview from 'browser/components/MarkdownPreview'
import CodeEditor from 'browser/components/CodeEditor'
import activityRecord from 'browser/lib/activityRecord'
import fetchConfig from 'browser/lib/fetchConfig'

const electron = require('electron')
const ipc = electron.ipcRenderer

export const PREVIEW_MODE = 'PREVIEW_MODE'
export const EDIT_MODE = 'EDIT_MODE'

let config = fetchConfig()
ipc.on('config-apply', function (e, newConfig) {
  config = newConfig
})

export default class ArticleEditor extends React.Component {
  constructor (props) {
    super(props)

    this.configApplyHandler = (e, config) => this.handleConfigApply(e, config)
    this.isMouseDown = false
    this.state = {
      status: PREVIEW_MODE,
      cursorPosition: null,
      firstVisibleRow: null,
      switchPreview: config['switch-preview']
    }
  }

  componentDidMount () {
    console.log(this.state.switchPreview)
    ipc.on('config-apply', this.configApplyHandler)
  }

  componentWillUnmount () {
    ipc.removeListener('config-apply', this.configApplyHandler)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.article.key !== this.props.article.key) {
      this.setState({
        content: this.props.article.content
      })
    }
  }

  handleConfigApply (e, newConfig) {
    this.setState({
      switchPreview: newConfig['switch-preview']
    })
  }

  resetCursorPosition () {
    this.setState({
      cursorPosition: null,
      firstVisibleRow: null
    }, function () {
      let previewEl = ReactDOM.findDOMNode(this.refs.preview)
      if (previewEl) previewEl.scrollTop = 0
    })
  }

  switchPreviewMode () {
    let cursorPosition = this.refs.editor.getCursorPosition()
    let firstVisibleRow = this.refs.editor.getFirstVisibleRow()
    this.setState({
      status: PREVIEW_MODE,
      cursorPosition,
      firstVisibleRow
    }, function () {
      let previewEl = ReactDOM.findDOMNode(this.refs.preview)
      let anchors = previewEl.querySelectorAll('.lineAnchor')
      for (let i = 0; i < anchors.length; i++) {
        if (parseInt(anchors[i].dataset.key, 10) > cursorPosition.row || i === anchors.length - 1) {
          var targetAnchor = anchors[i > 0 ? i - 1 : 0]
          previewEl.scrollTop = targetAnchor.offsetTop - 100
          break
        }
      }
    })
  }

  switchEditMode () {
    this.setState({
      status: EDIT_MODE
    }, function () {
      if (this.state.cursorPosition != null) {
        this.refs.editor.moveCursorTo(this.state.cursorPosition.row, this.state.cursorPosition.column)
        this.refs.editor.scrollToLine(this.state.firstVisibleRow)
      }
      this.refs.editor.editor.focus()
      activityRecord.emit('ARTICLE_UPDATE', this.props.article)
    })
  }

  handlePreviewMouseDown (e) {
    if (this.state.switchPreview === 'blur' && e.button === 0) {
      this.isDrag = false
      this.isMouseDown = true
      this.moveCount = 0
    }
  }

  handlePreviewMouseMove () {
    if (this.state.switchPreview === 'blur' && this.isMouseDown) {
      this.moveCount++
      if (this.moveCount > 5) {
        this.isDrag = true
      }
    }
  }

  handlePreviewMouseUp (e) {
    if (this.state.switchPreview === 'blur' && e.button === 0) {
      this.isMouseDown = false
      this.moveCount = 0
      if (!this.isDrag) {
        this.switchEditMode()
      }
    }
  }

  handleRightClickPreview (e) {
    let { article } = this.props
    if (this.state.switchPreview !== 'rightclick' || article.mode !== 'markdown') return true

    this.switchEditMode()
  }

  handleRightClickCodeEditor (e) {
    let { article } = this.props
    if (this.state.switchPreview !== 'rightclick' || article.mode !== 'markdown') return true

    this.switchPreviewMode()
  }

  handleBlurCodeEditor (e) {
    let isFocusingToThis = e.relatedTarget === ReactDOM.findDOMNode(this)
    if (isFocusingToThis || this.state.switchPreview !== 'blur') {
      return
    }

    let { article } = this.props
    if (article.mode === 'markdown') {
      this.switchPreviewMode()
    }
  }

  handleCodeEditorChange (value) {
    this.props.onChange(value)
  }

  render () {
    let { article } = this.props
    let showPreview = article.mode === 'markdown' && this.state.status === PREVIEW_MODE
    if (showPreview) {
      return (
        <div onContextMenu={e => this.handleRightClickPreview(e)} className='ArticleEditor'>
          <MarkdownPreview
            ref='preview'
            onMouseUp={e => this.handlePreviewMouseUp(e)}
            onMouseDown={e => this.handlePreviewMouseDown(e)}
            onMouseMove={e => this.handlePreviewMouseMove(e)}
            content={article.content}
          />
          <div className='ArticleDetail-panel-content-tooltip' children={
              this.state.switchPreview === 'blur'
                ? 'Click to Edit'
                : 'Right Click to Edit'
            }
          />
        </div>
      )
    }

    return (
      <div onContextMenu={e => this.handleRightClickCodeEditor(e)} tabIndex='5' className='ArticleEditor'>
        <CodeEditor
          ref='editor'
          onBlur={e => this.handleBlurCodeEditor(e)}
          onChange={value => this.handleCodeEditorChange(value)}
          article={article}
        />
        {article.mode === 'markdown'
          ? (
            <div className='ArticleDetail-panel-content-tooltip'
              children={
                this.state.switchPreview === 'blur'
                  ? 'Press ESC to Watch Preview'
                  : 'Right Click to Watch Preview'
              }
            />
          )
          : null
        }
      </div>
    )
  }
}

ArticleEditor.propTypes = {
  article: PropTypes.shape({
    content: PropTypes.string,
    key: PropTypes.string,
    mode: PropTypes.string
  }),
  onChange: PropTypes.func,
  parent: PropTypes.object
}
