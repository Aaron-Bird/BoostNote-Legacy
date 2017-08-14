import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './NewNoteButton.styl'
import _ from 'lodash'
import modal from 'browser/main/lib/modal'
import NewNoteModal from 'browser/main/modals/NewNoteModal'
import { hashHistory } from 'react-router'
import ee from 'browser/main/lib/eventEmitter'
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
      this.handleNewNoteButtonClick()
    }
  }

  componentDidMount () {
    ee.on('top:new-note', this.newNoteHandler)
  }

  componentWillUnmount () {
    ee.off('top:new-note', this.newNoteHandler)
  }

  handleNewNoteButtonClick (e) {
    const { config, location, dispatch } = this.props
    const { storage, folder } = this.resolveTargetFolder()

    modal.open(NewNoteModal, {
      storage: storage.key,
      folder: folder.key,
      dispatch,
      location
    })
  }

  resolveTargetFolder () {
    const { data, params } = this.props
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

  render () {
    const { config, style, data, location } = this.props
    if (location.pathname === '/trashed') {
      return ''
    } else {
      return (
        <div className='NewNoteButton'
          styleName={config.isSideNavFolded ? 'root--expanded' : 'root'}
          style={style}
        >
          <div styleName='control'>
            <button styleName='control-newNoteButton'
              onClick={(e) => this.handleNewNoteButtonClick(e)}>
              <i className='fa fa-pencil-square-o' />
              <span styleName='control-newNoteButton-tooltip'>
                Make a Note {OSX ? '⌘' : '^'} + n
              </span>
            </button>
          </div>
        </div>
      )
    }
  }
}

NewNoteButton.propTypes = {
  dispatch: PropTypes.func,
  config: PropTypes.shape({
    isSideNavFolded: PropTypes.bool
  })
}

export default CSSModules(NewNoteButton, styles)
