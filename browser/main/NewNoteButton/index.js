import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NewNoteButton.styl'
import _ from 'lodash'
import modal from 'browser/main/lib/modal'
import NewNoteModal from 'browser/main/modals/NewNoteModal'
import { hashHistory } from 'react-router'
import ee from 'browser/main/lib/eventEmitter'
import ConfigManager from 'browser/main/lib/ConfigManager'
import dataApi from 'browser/main/lib/dataApi'

const { remote } = require('electron')
const { dialog } = remote

const OSX = window.process.platform === 'darwin'

class NewNoteButton extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
    }

    this.newNoteHandler = () => {
      this.handleNewPostButtonClick()
    }

  }

  componentDidMount () {
    ee.on('top:new-note', this.newNoteHandler)
  }

  componentWillUnmount () {
    ee.off('top:new-note', this.newNoteHandler)
  }

  handleNewPostButtonClick (e) {
    let { config, location } = this.props

    if (location.pathname === '/trashed') {
      dialog.showMessageBox(remote.getCurrentWindow(), {
        type: 'warning',
        message: 'Cannot create new note',
        detail: 'You cannot create new note in trash box.',
        buttons: ['OK']
      })
      return
    }

    switch (config.ui.defaultNote) {
      case 'MARKDOWN_NOTE':
        this.createNote('MARKDOWN_NOTE')
        break
      case 'SNIPPET_NOTE':
        this.createNote('SNIPPET_NOTE')
        break
      case 'ALWAYS_ASK':
      default:
        let { dispatch, location } = this.props
        let { storage, folder } = this.resolveTargetFolder()

        modal.open(NewNoteModal, {
          storage: storage.key,
          folder: folder.key,
          dispatch,
          location
        })
    }
  }

  resolveTargetFolder () {
    let { data, params } = this.props
    let storage = data.storageMap.get(params.storageKey)

    // Find first storage
    if (storage == null) {
      for (let kv of data.storageMap) {
        storage = kv[1]
        break
      }
    }
    if (storage == null) window.alert('No storage to create a note')
    let folder = _.find(storage.folders, {key: params.folderKey})
    if (folder == null) folder = storage.folders[0]
    if (folder == null) window.alert('No folder to create a note')

    return {
      storage,
      folder
    }
  }

  createNote (noteType) {
    let { dispatch, location } = this.props
    if (noteType !== 'MARKDOWN_NOTE' && noteType !== 'SNIPPET_NOTE') throw new Error('Invalid note type.')

    let { storage, folder } = this.resolveTargetFolder()

    let newNote = noteType === 'MARKDOWN_NOTE'
      ? {
        type: 'MARKDOWN_NOTE',
        folder: folder.key,
        title: '',
        content: ''
      }
      : {
        type: 'SNIPPET_NOTE',
        folder: folder.key,
        title: '',
        description: '',
        snippets: [{
          name: '',
          mode: 'text',
          content: ''
        }]
      }

    dataApi
      .createNote(storage.key, newNote)
      .then((note) => {
        dispatch({
          type: 'UPDATE_NOTE',
          note: note
        })
        hashHistory.push({
          pathname: location.pathname,
          query: {key: note.storage + '-' + note.key}
        })
        ee.emit('detail:focus')
      })
  }

  setDefaultNote (defaultNote) {
    let { config, dispatch } = this.props
    let ui = Object.assign(config.ui)
    ui.defaultNote = defaultNote
    ConfigManager.set({
      ui
    })

    dispatch({
      type: 'SET_UI',
      config: ConfigManager.get()
    })
  }

  render () {
    let { config, style, data } = this.props
    return (
      <div className='NewNoteButton'
        styleName={config.isSideNavFolded ? 'root--expanded' : 'root'}
        style={style}
      >
        <div styleName='control'>
          <button styleName='control-newPostButton'
            onClick={(e) => this.handleNewPostButtonClick(e)}>
            <i className='fa fa-pencil-square-o' />
            <span styleName='control-newPostButton-tooltip'>
              Make a Note {OSX ? '⌘' : '^'} + n
            </span>
          </button>
        </div>
      </div>
    )
  }
}

NewNoteButton.contextTypes = {
  router: PropTypes.shape({
    push: PropTypes.func
  })
}

NewNoteButton.propTypes = {
  dispatch: PropTypes.func,
  config: PropTypes.shape({
    isSideNavFolded: PropTypes.bool
  })
}

export default CSSModules(NewNoteButton, styles)
