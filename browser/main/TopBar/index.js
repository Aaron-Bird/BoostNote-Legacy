import React, { PropTypes } from 'react'
import CSSModules from 'browser/lib/CSSModules'
import styles from './TopBar.styl'
import _ from 'lodash'
import modal from 'browser/main/lib/modal'
import NewNoteModal from 'browser/main/modals/NewNoteModal'
import { hashHistory } from 'react-router'
import ee from 'browser/main/lib/eventEmitter'

const OSX = window.process.platform === 'darwin'

class TopBar extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      search: '',
      searchOptions: [],
      searchPopupOpen: false
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

  handleSearchChange (e) {
    this.setState({
      search: this.refs.searchInput.value
    })
  }

  getOptions () {
    let { notes } = this.props
    let { search } = this.state
    if (search.trim().length === 0) return []
    let searchBlocks = search.split(' ')
    searchBlocks.forEach((block) => {
      if (block.match(/^#.+/)) {
        let tag = block.match(/#(.+)/)[1]
        let regExp = new RegExp(_.escapeRegExp(tag), 'i')
        notes = notes
          .filter((note) => {
            if (!_.isArray(note.tags)) return false
            return note.tags.some((_tag) => {
              return _tag.match(regExp)
            })
          })
      } else {
        let regExp = new RegExp(_.escapeRegExp(block), 'i')
        notes = notes.filter((note) => {
          if (note.type === 'SNIPPET_NOTE') {
            return note.description.match(regExp)
          } else if (note.type === 'MARKDOWN_NOTE') {
            return note.content.match(regExp)
          }
          return false
        })
      }
    })

    return notes
  }

  handleOptionClick (uniqueKey) {
    return (e) => {
      this.setState({
        searchPopupOpen: false
      }, () => {
        let { location } = this.props
        hashHistory.push({
          pathname: location.pathname,
          query: {
            key: uniqueKey
          }
        })
      })
    }
  }

  handleSearchFocus (e) {
    this.setState({
      searchPopupOpen: true
    })
  }
  handleSearchBlur (e) {
    e.stopPropagation()

    let el = e.relatedTarget
    let isStillFocused = false
    while (el != null) {
      if (el === this.refs.search) {
        isStillFocused = true
        break
      }
      el = el.parentNode
    }
    if (!isStillFocused) {
      this.setState({
        searchPopupOpen: false
      })
    }
  }

  render () {
    let { config, style, storages } = this.props
    let searchOptionList = this.getOptions()
      .map((note) => {
        let storage = _.find(storages, {key: note.storage})
        let folder = _.find(storage.folders, {key: note.folder})
        return <div styleName='control-search-optionList-item'
          key={note.uniqueKey}
          onClick={(e) => this.handleOptionClick(note.uniqueKey)(e)}
        >
          <div styleName='control-search-optionList-item-folder'
            style={{borderColor: folder.color}}>
            {folder.name}
            <span styleName='control-search-optionList-item-folder-surfix'>in {storage.name}</span>
          </div>
          {note.type === 'SNIPPET_NOTE'
            ? <i styleName='control-search-optionList-item-type' className='fa fa-code'/>
            : <i styleName='control-search-optionList-item-type' className='fa fa-file-text-o'/>
          }&nbsp;
          {note.title}
        </div>
      })

    return (
      <div className='TopBar'
        styleName={config.isSideNavFolded ? 'root--expanded' : 'root'}
        style={style}
      >
        <div styleName='control'>
          <div styleName='control-search'>
            <i styleName='control-search-icon' className='fa fa-search fa-fw'/>
            <div styleName='control-search-input'
              onFocus={(e) => this.handleSearchFocus(e)}
              onBlur={(e) => this.handleSearchBlur(e)}
              tabIndex='-1'
              ref='search'
            >
              <input
                ref='searchInput'
                value={this.state.search}
                onChange={(e) => this.handleSearchChange(e)}
                placeholder='Search'
                type='text'
              />
              {this.state.searchPopupOpen &&
                <div styleName='control-search-optionList'>
                  {searchOptionList.length > 0
                    ? searchOptionList
                    : <div styleName='control-search-optionList-empty'>Empty List</div>
                  }
                </div>
              }
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
