import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import MarkdownPreview from 'browser/components/MarkdownPreview'
import CodeEditor from 'browser/components/CodeEditor'

export const PREVIEW_MODE = 'PREVIEW_MODE'
export const EDIT_MODE = 'EDIT_MODE'

export default class ArticleEditor extends React.Component {
  constructor (props) {
    super(props)
    this.isMouseDown = false
    this.state = {
      status: PREVIEW_MODE
    }
  }

  componentWillReceiveProps (nextProps) {
  }

  switchPreviewMode () {
    this.setState({
      status: PREVIEW_MODE
    })
  }

  switchEditMode () {
    this.setState({
      status: EDIT_MODE
    }, function () {
      this.refs.editor.editor.focus()
    })
  }

  handlePreviewMouseDown (e) {
    if (e.button === 2) return true
    this.isDrag = false
    this.isMouseDown = true
  }

  handlePreviewMouseMove () {
    if (this.isMouseDown) this.isDrag = true
  }

  handlePreviewMouseUp () {
    this.isMouseDown = false
    if (!this.isDrag) {
      this.switchEditMode()
    }
  }

  handleBlurCodeEditor () {
    if (this.props.mode === 'markdown') {
      this.switchPreviewMode()
    }
  }

  render () {
    if (this.props.mode === 'markdown' && this.state.status === PREVIEW_MODE) {
      return (
        <div className='ArticleEditor'>
          <MarkdownPreview
            onMouseUp={e => this.handlePreviewMouseUp(e)}
            onMouseDown={e => this.handlePreviewMouseDown(e)}
            onMouseMove={e => this.handlePreviewMouseMove(e)}
            content={this.props.content}
          />
          <div className='ArticleDetail-panel-content-tooltip'>Click to Edit</div>
        </div>
      )
    }

    return (
      <div className='ArticleEditor'>
        <CodeEditor ref='editor'
          onBlur={e => this.handleBlurCodeEditor(e)}
          onChange={this.props.onChange}
          mode={this.props.mode}
          code={this.props.content}
        />
        {this.props.mode === 'markdown'
          ? (
            <div className='ArticleDetail-panel-content-tooltip'>Press ESC to watch Preview</div>
          )
          : null
        }
      </div>
    )
  }
}

ArticleEditor.propTypes = {
  content: PropTypes.string,
  mode: PropTypes.string,
  onChange: PropTypes.func
}
