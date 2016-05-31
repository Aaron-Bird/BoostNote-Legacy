import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NoteDetail.styl'
import MarkdownEditor from 'browser/components/MarkdownEditor'
import queue from 'browser/main/lib/queue'
import StarButton from './StarButton'
import TagSelect from './TagSelect'
import FolderSelect from './FolderSelect'
import Repository from 'browser/lib/Repository'

class NoteDetail extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      note: Object.assign({}, props.note),
      isDispatchQueued: false
    }
    this.dispatchTimer = null
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.note.key !== this.props.note.key) {
      if (this.state.isDispatchQueued) {
        this.cancelDispatchQueue()
        this.dispatch()
      }
      this.setState({
        note: Object.assign({}, nextProps.note),
        isDispatchQueued: false
      }, () => {
        this.refs.content.reload()
        this.refs.tags.reset()
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
    note.tags = this.refs.tags.value
    note.folder = this.refs.folder.value

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
    }, 100)
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

  handleStarButtonClick (e) {
    let { note } = this.state
    let { dispatch } = this.props

    let isStarred = note._repository.starred.some((starredKey) => starredKey === note.key)

    if (isStarred) {
      Repository
        .find(note._repository.key)
        .then((repo) => {
          return repo.unstarNote(note.key)
        })

      dispatch({
        type: 'UNSTAR_NOTE',
        repository: note._repository.key,
        note: note.key
      })
    } else {
      Repository
        .find(note._repository.key)
        .then((repo) => {
          return repo.starNote(note.key)
        })

      dispatch({
        type: 'STAR_NOTE',
        repository: note._repository.key,
        note: note.key
      })
    }
  }

  render () {
    let { note } = this.state
    let isStarred = note._repository.starred.some((starredKey) => starredKey === note.key)
    let folders = note._repository.folders

    return (
      <div className='NoteDetail'
        style={this.props.style}
        styleName='root'
      >
        <div styleName='info'>
          <div styleName='info-left'>

            <div styleName='info-left-top'>
              <StarButton styleName='info-left-top-starButton'
                onClick={(e) => this.handleStarButtonClick(e)}
                isActive={isStarred}
              />
              <FolderSelect styleName='info-left-top-folderSelect'
                value={this.state.note.folder}
                ref='folder'
                folders={folders}
                onChange={() => this.handleChange()}
              />
            </div>
            <div styleName='info-left-bottom'>
              <TagSelect
                styleName='info-left-bottom-tagSelect'
                ref='tags'
                value={this.state.note.tags}
                onChange={(e) => this.handleChange(e)}
              />
            </div>
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
  note: PropTypes.shape({

  }),
  style: PropTypes.shape({
    left: PropTypes.number
  }),
  ignorePreviewPointerEvents: PropTypes.bool
}

export default CSSModules(NoteDetail, styles)
