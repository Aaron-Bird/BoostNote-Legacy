import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './MarkdownNoteDetail.styl'
import MarkdownEditor from 'browser/components/MarkdownEditor'
import StarButton from './StarButton'
import TagSelect from './TagSelect'
import FolderSelect from './FolderSelect'
import Commander from 'browser/main/lib/Commander'
import dataApi from 'browser/main/lib/dataApi'

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
        content: ''
      }, props.note),
      isDispatchQueued: false
    }
    this.dispatchTimer = null
  }

  componentDidMount () {
    Commander.bind('note-detail', this)
  }

  componentWillUnmount () {
    Commander.release(this)
  }

  fire (command) {
    switch (command) {
      case 'focus':
        this.refs.content.focus()
    }
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
    note.title = this.findTitle(note.content)
    note.updatedAt = new Date()

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
      click: (e) => this.handlePreferencesButtonClick(e)
    }))
    menu.popup(remote.getCurrentWindow())
  }

  render () {
    let { storages, config } = this.props
    let { note } = this.state

    return (
      <div className='NoteDetail'
        style={this.props.style}
        styleName='root'
      >
        <div styleName='info'>
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
