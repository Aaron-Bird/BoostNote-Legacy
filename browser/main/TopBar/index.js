import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './TopBar.styl'
import activityRecord from 'browser/lib/activityRecord'
import _ from 'lodash'
import Commander from 'browser/main/lib/Commander'
import dataApi from 'browser/main/lib/dataApi'
import modal from 'browser/main/lib/modal'
import NewNoteModal from 'browser/main/modals/NewNoteModal'

const OSX = window.process.platform === 'darwin'

class TopBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      search: ''
    }
  }

  isInputFocused () {
    return document.activeElement === this.refs.searchInput
  }

  escape () {
  }

  focusInput () {
    this.searchInput.focus()
  }

  blurInput () {
    this.searchInput.blur()
  }

  handleNewPostButtonClick (e) {
    let { storages, params, dispatch, location } = this.props
    let storage = _.find(storages, {key: params.storageKey})
    if (storage == null) storage = storages[0]
    if (storage == null) throw new Error('No storage to create a note')
    let folder = _.find(storage.folders, {key: params.folderKey})
    if (folder == null) folder = storage.folders[0]
    if (folder == null) throw new Error('No folder to craete a note')

    modal.open(NewNoteModal, {
      storage: storage.key,
      folder: folder.key,
      dispatch,
      location
    })
  }

  handleTutorialButtonClick (e) {
  }

  render () {
    let { config, style } = this.props
    return (
      <div className='TopBar'
        styleName={config.isSideNavFolded ? 'root--expanded' : 'root'}
        style={style}
      >
        <div styleName='control'>
          <div styleName='control-search'>
            <i styleName='control-search-icon' className='fa fa-search fa-fw'/>
            <div styleName='control-search-input'>
              <input
                ref='searchInput'
                onFocus={(e) => this.handleSearchChange(e)}
                onBlur={(e) => this.handleSearchChange(e)}
                value={this.state.search}
                onChange={(e) => this.handleSearchChange(e)}
                placeholder='Search'
                type='text'
              />
            </div>
            {this.state.search > 0 &&
              <button styleName='left-search-clearButton'
                onClick={(e) => this.handleSearchClearButton(e)}
              >
                <i className='fa fa-times'/>
              </button>
            }

          </div>
          <button styleName='control-newPostButton'
            onClick={(e) => this.handleNewPostButtonClick(e)}>
            <i className='fa fa-plus'/>
            <span styleName='control-newPostButton-tooltip'>
              New Note {OSX ? '⌘' : '^'} + n
            </span>
          </button>
        </div>
      </div>
    )
  }
}

TopBar.contextTypes = {
  router: PropTypes.shape({
    push: PropTypes.func
  })
}

TopBar.propTypes = {
  dispatch: PropTypes.func,
  config: PropTypes.shape({
    isSideNavFolded: PropTypes.bool
  })
}

export default CSSModules(TopBar, styles)
