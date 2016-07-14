import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './TopBar.styl'
import activityRecord from 'browser/lib/activityRecord'
import _ from 'lodash'
import Commander from 'browser/main/lib/Commander'
import dataApi from 'browser/main/lib/dataApi'

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
    let { storages, params, dispatch } = this.props
    let storage = _.find(storages, {key: params.storageKey})
    if (storage == null) storage = storages[0]
    if (storage == null) throw new Error('No storage to create a note')
    let folder = _.find(storage.folders, {key: params.folderKey})
    if (folder == null) folder = storage.folders[0]
    if (folder == null) throw new Error('No folder to craete a note')
    // activityRecord.emit('ARTICLE_CREATE')
    console.log(storage, folder)
    dataApi
      .createNote(storage.key, folder.key, {
        title: '',
        content: ''
      })
      .then((note) => {
        dispatch({
          type: 'CREATE_NOTE',
          note: note
        })
      })
  }

  handleTutorialButtonClick (e) {
  }

  render () {
    let { config } = this.props
    return (
      <div className='TopBar'
        styleName={config.isSideNavFolded ? 'root--expanded' : 'root'}
      >
        <div styleName='left'>
          <div styleName='left-search'>
            <i styleName='left-search-icon' className='fa fa-search fa-fw'/>
            <input styleName='left-search-input'
              ref='searchInput'
              onFocus={(e) => this.handleSearchChange(e)}
              onBlur={(e) => this.handleSearchChange(e)}
              value={this.state.search}
              onChange={(e) => this.handleSearchChange(e)}
              placeholder='Search'
              type='text'
            />
            {this.state.search > 0 &&
              <button styleName='left-search-clearButton'
                onClick={(e) => this.handleSearchClearButton(e)}
              >
                <i className='fa fa-times'/>
              </button>
            }
          </div>

          <div styleName='left-control'>
            <button styleName='left-control-newPostButton'
              onClick={(e) => this.handleNewPostButtonClick(e)}>
              <i className='fa fa-plus'/>
              <span styleName='left-control-newPostButton-tooltip'>
                New Note {OSX ? '⌘' : '^'} + n
              </span>
            </button>
          </div>
        </div>

        <div styleName='right'>
          <button styleName='right-helpButton'
            onClick={(e) => this.handleTutorialButtonClick(e)}
            disabled
          >
            ?<span styleName='left-control-newPostButton-tooltip'>How to use</span>
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
