import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NoteDetail.styl'
import MarkdownEditor from 'browser/components/MarkdownEditor'
import queue from 'browser/main/lib/queue'

class NoteDetail extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      note: Object.assign({}, props.note),
      isDispatchQueued: false
    }
    this.dispatchTimer = null
  }

  componentDidUpdate (prevProps, prevState) {
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.note.key !== this.props.note.key) {
      if (this.state.isDispatchQueued) {
        this.dispatch()
      }
      this.setState({
        note: Object.assign({}, nextProps.note),
        isDispatchQueued: false
      }, () => {
        this.refs.content.reload()
      })
    }
  }

  findTitle (value) {
    let splitted = value.split('\n')
    let title = null

    for (let i = 0; i < splitted.length; i++) {
      let trimmedLine = splitted[i].trim()
      if (trimmedLine.match(/^# .+/)) {
        title = trimmedLine.substring(1, trimmedLine.length).trim()
        break
      }
    }

    if (title == null) {
      for (let i = 0; i < splitted.length; i++) {
        let trimmedLine = splitted[i].trim()
        if (trimmedLine.length > 0) {
          title = trimmedLine
          break
        }
      }
      if (title == null) {
        title = ''
      }
    }

    return title
  }

  handleChange (e) {
    let { note } = this.state

    note.content = this.refs.content.value

    this.setState({
      note,
      isDispatchQueued: true
    }, () => {
      this.queueDispatch()
    })
  }

  cancelDispatchQueue () {
    if (this.dispatchTimer != null) {
      window.clearTimeout(this.dispatchTimer)
      this.dispatchTimer = null
    }
  }

  queueDispatch () {
    this.cancelDispatchQueue()

    this.dispatchTimer = window.setTimeout(() => {
      this.dispatch()
      this.setState({
        isDispatchQueued: false
      })
    }, 500)
  }

  dispatch () {
    let { note } = this.state
    note = Object.assign({}, note)
    let repoKey = note._repository.key
    note.title = this.findTitle(note.content)

    let { dispatch } = this.props
    dispatch({
      type: 'SAVE_NOTE',
      repository: repoKey,
      note: note
    })
    queue.save(repoKey, note)
  }

  render () {
    return (
      <div className='NoteDetail'
        style={this.props.style}
        styleName='root'
      >
        <div styleName='info'>
          <div styleName='info-left'>
            <div styleName='info-left-folderSelect'>FOLDER SELECT</div>
            <div styleName='info-left-tagSelect'>TAG SELECT</div>
          </div>
          <div styleName='info-right'>
            <button styleName='info-right-button'>
              <i className='fa fa-clipboard fa-fw'/>
            </button>
            <button styleName='info-right-button'>
              <i className='fa fa-share-alt fa-fw'/>
            </button>
            <button styleName='info-right-button'>
              <i className='fa fa-ellipsis-v'/>
            </button>
          </div>
        </div>
        <div styleName='body'>
          <MarkdownEditor
            ref='content'
            styleName='body-noteEditor'
            value={this.state.note.content}
            onChange={(e) => this.handleChange(e)}
            ignorePreviewPointerEvents={this.props.ignorePreviewPointerEvents}
          />
        </div>
      </div>
    )
  }
}

NoteDetail.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array,
  style: PropTypes.shape({
    left: PropTypes.number
  }),
  ignorePreviewPointerEvents: PropTypes.bool
}

export default CSSModules(NoteDetail, styles)
