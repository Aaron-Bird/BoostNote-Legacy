import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './SnippetNoteDetail.styl'
import CodeEditor from 'browser/components/CodeEditor'
import StarButton from './StarButton'
import TagSelect from './TagSelect'
import FolderSelect from './FolderSelect'
import dataApi from 'browser/main/lib/dataApi'
import modes from 'browser/lib/modes'
import { hashHistory } from 'react-router'
import ee from 'browser/main/lib/eventEmitter'

const electron = require('electron')
const { remote } = electron
const Menu = remote.Menu
const MenuItem = remote.MenuItem

class SnippetNoteDetail extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      snippetIndex: 0,
      note: Object.assign({
        description: ''
      }, props.note, {
        snippets: props.note.snippets.map((snippet) => Object.assign({}, snippet))
      }),
      isDeleting: false
    }
  }

  focus () {
    this.refs.description.focus()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.note.key !== this.props.note.key) {
      let nextNote = Object.assign({
        description: ''
      }, nextProps.note, {
        snippets: nextProps.note.snippets.map((snippet) => Object.assign({}, snippet))
      })
      this.setState({
        snippetIndex: 0,
        note: nextNote,
        isDeleting: false
      }, () => {
        let { snippets } = this.state.note
        snippets.forEach((snippet, index) => {
          this.refs['code-' + index].reload()
        })
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

    note.tags = this.refs.tags.value
    note.description = this.refs.description.value
    note.updatedAt = new Date()
    note.title = this.findTitle(note.description)

    this.setState({
      note
    }, () => {
      this.save()
    })
  }

  save () {
    let { note, dispatch } = this.props

    dispatch({
      type: 'UPDATE_NOTE',
      note: this.state.note
    })

    dataApi
      .updateNote(note.storage, note.folder, note.key, this.state.note)
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
      disabled: true,
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
      })
  }

  handleDeleteCancelButtonClick (e) {
    this.setState({
      isDeleting: false
    })
  }

  handleTabPlusButtonClick (e) {
    let { note } = this.state

    note.snippets = note.snippets.concat([{
      name: '',
      mode: 'text',
      content: ''
    }])

    this.setState({
      note
    })
  }

  handleTabButtonClick (index) {
    return (e) => {
      this.setState({
        snippetIndex: index
      })
    }
  }

  handleTabDeleteButtonClick (index) {
    return (e) => {
      if (this.state.note.snippets.length > 1) {
        let snippets = this.state.note.snippets.slice()
        snippets.splice(index, 1)
        this.state.note.snippets = snippets
        this.setState({
          note: this.state.note
        })
      }
    }
  }

  handleNameInputChange (index) {
    return (e) => {
      let snippets = this.state.note.snippets.slice()
      snippets[index].name = e.target.value
      this.state.note.snippets = snippets

      this.setState({
        note: this.state.note
      }, () => {
        this.save()
      })
    }
  }

  handleModeButtonClick (index) {
    return (e) => {
      let menu = new Menu()
      modes.forEach((mode) => {
        menu.append(new MenuItem({
          label: mode.label,
          click: (e) => this.handleModeOptionClick(index, mode.name)(e)
        }))
      })
      menu.popup(remote.getCurrentWindow())
    }
  }

  handleModeOptionClick (index, name) {
    return (e) => {
      let snippets = this.state.note.snippets.slice()
      snippets[index].mode = name
      this.state.note.snippets = snippets

      this.setState({
        note: this.state.note
      }, () => {
        this.save()
      })
    }
  }

  handleCodeChange (index) {
    return (e) => {
      let snippets = this.state.note.snippets.slice()
      snippets[index].content = this.refs['code-' + index].value
      this.state.note.snippets = snippets
      this.setState({
        note: this.state.note
      }, () => {
        this.save()
      })
    }
  }

  render () {
    let { storages, config } = this.props
    let { note } = this.state

    let editorFontSize = parseInt(config.editor.fontSize, 10)
    if (!(editorFontSize > 0 && editorFontSize < 101)) editorFontSize = 14
    let editorIndentSize = parseInt(config.editor.indentSize, 10)
    if (!(editorFontSize > 0 && editorFontSize < 132)) editorIndentSize = 4

    let tabList = note.snippets.map((snippet, index) => {
      let isActive = this.state.snippetIndex === index
      return <div styleName={isActive
          ? 'tabList-item--active'
          : 'tabList-item'
        }
        key={index}
      >
        <button styleName='tabList-item-button'
          onClick={(e) => this.handleTabButtonClick(index)(e)}
        >
          {snippet.name.trim().length > 0
            ? snippet.name
            : <span styleName='tabList-item-unnamed'>
              Unnamed
            </span>
          }
        </button>
        {note.snippets.length > 1 &&
          <button styleName='tabList-item-deleteButton'
            onClick={(e) => this.handleTabDeleteButtonClick(index)(e)}
          >
            <i className='fa fa-times'/>
          </button>
        }
      </div>
    })
    let viewList = note.snippets.map((snippet, index) => {
      let isActive = this.state.snippetIndex === index
      let mode = snippet.mode === 'text'
        ? null
        : modes.filter((mode) => mode.name === snippet.mode)[0]

      return <div styleName='tabView'
        key={index}
        style={{zIndex: isActive ? 5 : 4}}
      >
        <div styleName='tabView-top'>
          <input styleName='tabView-top-name'
            placeholder='Filename including extensions...'
            value={snippet.name}
            onChange={(e) => this.handleNameInputChange(index)(e)}
          />
          <button styleName='tabView-top-mode'
            onClick={(e) => this.handleModeButtonClick(index)(e)}
          >
            {mode == null
              ? 'Select Syntax...'
              : mode.label
            }&nbsp;
            <i className='fa fa-caret-down'/>
          </button>
        </div>
        <CodeEditor styleName='tabView-content'
          mode={snippet.mode}
          value={snippet.content}
          theme={config.editor.theme}
          fontFamily={config.editor.fontFamily}
          fontSize={editorFontSize}
          indentType={config.editor.indentType}
          indentSize={editorIndentSize}
          onChange={(e) => this.handleCodeChange(index)(e)}
          ref={'code-' + index}
        />
      </div>
    })

    return (
      <div className='NoteDetail'
        style={this.props.style}
        styleName='root'
      >
        {this.state.isDeleting
          ? <div styleName='info'>
            <div styleName='info-delete'>

              <span styleName='info-delete-message'>
                Are you sure to delete this note?
              </span>
              <button styleName='info-delete-cancelButton'
                onClick={(e) => this.handleDeleteCancelButtonClick(e)}
              >Cancel</button>
              <button styleName='info-delete-confirmButton'
                onClick={(e) => this.handleDeleteConfirmButtonClick(e)}
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
          <div styleName='body-description'>
            <textarea styleName='body-description-textarea'
              style={{
                fontFamily: config.preview.fontFamily,
                fontSize: parseInt(config.preview.fontSize, 10)
              }}
              ref='description'
              placeholder='Description...'
              value={this.state.note.description}
              onChange={(e) => this.handleChange(e)}
            />
          </div>
          <div styleName='tabList'>
            {tabList}
            <button styleName='tabList-plusButton'
              onClick={(e) => this.handleTabPlusButtonClick(e)}
            >
              <i className='fa fa-plus'/>
            </button>
          </div>
          {viewList}
        </div>
      </div>
    )
  }
}

SnippetNoteDetail.propTypes = {
  dispatch: PropTypes.func,
  repositories: PropTypes.array,
  note: PropTypes.shape({

  }),
  style: PropTypes.shape({
    left: PropTypes.number
  }),
  ignorePreviewPointerEvents: PropTypes.bool
}

export default CSSModules(SnippetNoteDetail, styles)
