import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './MarkdownNoteDetail.styl'
import MarkdownEditor from 'browser/components/MarkdownEditor'
import StarButton from './StarButton'
import TagSelect from './TagSelect'
import FolderSelect from './FolderSelect'
import dataApi from 'browser/main/lib/dataApi'
import { hashHistory } from 'react-router'
import ee from 'browser/main/lib/eventEmitter'

const electron = require('electron')
const { remote } = electron
const Menu = remote.Menu
const MenuItem = remote.MenuItem

class MarkdownNoteDetail extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      note: Object.assign({
        title: '',
        content: '',
        isMovingNote: false,
        isDeleting: false
      }, props.note)
    }
    this.dispatchTimer = null
  }

  focus () {
    this.refs.content.focus()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.note.key !== this.props.note.key && !this.isMovingNote) {
      this.setState({
        note: Object.assign({}, nextProps.note),
        isDeleting: false
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
    note.title = this.findTitle(note.content)
    note.updatedAt = new Date()

    this.setState({
      note
    }, () => {
      this.save()
    })
  }

  save () {
    clearTimeout(this.saveQueue)
    this.saveQueue = setTimeout(() => {
      let { note, dispatch } = this.props
      dispatch({
        type: 'UPDATE_NOTE',
        note: this.state.note
      })

      dataApi
        .updateNote(note.storage, note.folder, note.key, this.state.note)
    }, 1000)
  }

  handleFolderChange (e) {
    let { note } = this.state
    let value = this.refs.folder.value
    let splitted = value.split('-')
    let newStorageKey = splitted.shift()
    let newFolderKey = splitted.shift()

    dataApi
      .moveNote(note.storage, note.folder, note.key, newStorageKey, newFolderKey)
      .then((newNote) => {
        this.setState({
          isMovingNote: true,
          note: Object.assign({}, newNote)
        }, () => {
          let { dispatch, location } = this.props
          dispatch({
            type: 'MOVE_NOTE',
            note: note,
            newNote: newNote
          })
          hashHistory.replace({
            pathname: location.pathname,
            query: {
              key: newNote.uniqueKey
            }
          })
          this.setState({
            isMovingNote: false
          })
        })
      })
  }

  handleStarButtonClick (e) {
    let { note } = this.state

    note.isStarred = !note.isStarred

    this.setState({
      note
    }, () => {
      this.save()
    })
  }

  exportAsFile () {

  }

  handleShareButtonClick (e) {
    let menu = new Menu()
    menu.append(new MenuItem({
      label: 'Export as a File',
      click: (e) => this.handlePreferencesButtonClick(e)
    }))
    menu.append(new MenuItem({
      label: 'Export to Web',
      disabled: true,
      click: (e) => this.handlePreferencesButtonClick(e)
    }))
    menu.popup(remote.getCurrentWindow())
  }

  handleContextButtonClick (e) {
    let menu = new Menu()
    menu.append(new MenuItem({
      label: 'Delete',
      click: (e) => this.handleDeleteMenuClick(e)
    }))
    menu.popup(remote.getCurrentWindow())
  }

  handleDeleteMenuClick (e) {
    this.setState({
      isDeleting: true
    }, () => {
      this.refs.deleteConfirmButton.focus()
    })
  }

  handleDeleteConfirmButtonClick (e) {
    let { note, dispatch } = this.props
    dataApi
      .removeNote(note.storage, note.folder, note.key)
      .then(() => {
        let dispatchHandler = () => {
          dispatch({
            type: 'REMOVE_NOTE',
            note: note
          })
        }
        ee.once('list:moved', dispatchHandler)
        ee.emit('list:next')
        ee.emit('list:focus')
      })
  }

  handleDeleteCancelButtonClick (e) {
    this.setState({
      isDeleting: false
    })
  }

  handleDeleteKeyDown (e) {
    if (e.keyCode === 27) this.handleDeleteCancelButtonClick(e)
  }

  render () {
    let { storages, config } = this.props
    let { note } = this.state

    return (
      <div className='NoteDetail'
        style={this.props.style}
        styleName='root'
      >
        {this.state.isDeleting
          ? <div styleName='info'>
            <div styleName='info-delete'
              tabIndex='-1'
              onKeyDown={(e) => this.handleDeleteKeyDown(e)}
            >

              <span styleName='info-delete-message'>
                Are you sure to delete this note?
              </span>
              <button styleName='info-delete-cancelButton'
                onClick={(e) => this.handleDeleteCancelButtonClick(e)}
              >Cancel</button>
              <button styleName='info-delete-confirmButton'
                onClick={(e) => this.handleDeleteConfirmButtonClick(e)}
                ref='deleteConfirmButton'
              >Confirm</button>
            </div>
          </div>
          : <div styleName='info'>
            <div styleName='info-left'>
              <div styleName='info-left-top'>
                <FolderSelect styleName='info-left-top-folderSelect'
                  value={this.state.note.storage + '-' + this.state.note.folder}
                  ref='folder'
                  storages={storages}
                  onChange={(e) => this.handleFolderChange(e)}
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
              <StarButton styleName='info-right-button'
                onClick={(e) => this.handleStarButtonClick(e)}
                isActive={note.isStarred}
              />
              <button styleName='info-right-button'
                onClick={(e) => this.handleShareButtonClick(e)}
              >
                <i className='fa fa-share-alt fa-fw'/>
              </button>
              <button styleName='info-right-button'
                onClick={(e) => this.handleContextButtonClick(e)}
              >
                <i className='fa fa-ellipsis-v'/>
              </button>
            </div>
          </div>
        }
        <div styleName='body'>
          <MarkdownEditor
            ref='content'
            styleName='body-noteEditor'
            config={config}
            value={this.state.note.content}
            onChange={(e) => this.handleChange(e)}
            ignorePreviewPointerEvents={this.props.ignorePreviewPointerEvents}
          />
        </div>
      </div>
    )
  }
}

MarkdownNoteDetail.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array,
  note: PropTypes.shape({

  }),
  style: PropTypes.shape({
    left: PropTypes.number
  }),
  ignorePreviewPointerEvents: PropTypes.bool
}

export default CSSModules(MarkdownNoteDetail, styles)
