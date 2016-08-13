import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import _ from 'lodash'
import ipc from './ipcClient'
import store from './store'
import CSSModules from 'browser/lib/CSSModules'
import styles from './FinderMain.styl'
import StorageSection from './StorageSection'
import NoteList from './NoteList'
import NoteDetail from './NoteDetail'

const electron = require('electron')
const { remote } = electron
const { Menu } = remote

function hideFinder () {
  let finderWindow = remote.getCurrentWindow()
  if (global.process.platform === 'win32') {
    finderWindow.blur()
    finderWindow.hide()
  }
  if (global.process.platform === 'darwin') {
    Menu.sendActionToFirstResponder('hide:')
  }
  remote.getCurrentWindow().hide()
}

require('!!style!css!stylus?sourceMap!../styles/finder/index.styl')

class FinderMain extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      search: '',
      index: 0,
      filter: {
        includeSnippet: true,
        includeMarkdown: false,
        type: 'ALL',
        storage: null,
        folder: null
      }
    }

    this.focusHandler = (e) => this.handleWindowFocus(e)
    this.blurHandler = (e) => this.handleWindowBlur(e)
  }

  componentDidMount () {
    this.refs.search.focus()
    window.addEventListener('focus', this.focusHandler)
    window.addEventListener('blur', this.blurHandler)
  }

  componentWillUnmount () {
    window.removeEventListener('focus', this.focusHandler)
    window.removeEventListener('blur', this.blurHandler)
  }

  handleWindowFocus (e) {
    this.refs.search.focus()
  }

  handleWindowBlur (e) {
    let { filter } = this.state
    filter.type = 'ALL'
    this.setState({
      search: '',
      filter,
      index: 0
    })
  }

  handleKeyDown (e) {
    this.refs.search.focus()
    if (e.keyCode === 9) {
      if (e.shiftKey) {
        this.refs.detail.selectPriorSnippet()
      } else {
        this.refs.detail.selectNextSnippet()
      }
      e.preventDefault()
    }
    if (e.keyCode === 38) {
      this.selectPrevious()
      e.preventDefault()
    }

    if (e.keyCode === 40) {
      this.selectNext()
      e.preventDefault()
    }

    if (e.keyCode === 13) {
      this.refs.detail.saveToClipboard()
      hideFinder()
      e.preventDefault()
    }
    if (e.keyCode === 27) {
      hideFinder()
      e.preventDefault()
    }
    if (e.keyCode === 91 || e.metaKey) {
      return
    }
  }

  handleSearchChange (e) {
    this.setState({
      search: e.target.value,
      index: 0
    })
  }

  selectArticle (article) {
    this.setState({currentArticle: article})
  }

  selectPrevious () {
    if (this.state.index > 0) {
      this.setState({
        index: this.state.index - 1
      })
    }
  }

  selectNext () {
    if (this.state.index < this.noteCount - 1) {
      this.setState({
        index: this.state.index + 1
      })
    }
  }

  handleOnlySnippetCheckboxChange (e) {
    let { filter } = this.state
    filter.includeSnippet = e.target.checked
    this.setState({
      filter: filter,
      index: 0
    }, () => {
      this.refs.search.focus()
    })
  }

  handleOnlyMarkdownCheckboxChange (e) {
    let { filter } = this.state
    filter.includeMarkdown = e.target.checked
    this.refs.list.resetScroll()
    this.setState({
      filter: filter,
      index: 0
    }, () => {
      this.refs.search.focus()
    })
  }

  handleAllNotesButtonClick (e) {
    let { filter } = this.state
    filter.type = 'ALL'
    this.refs.list.resetScroll()
    this.setState({
      filter,
      index: 0
    }, () => {
      this.refs.search.focus()
    })
  }

  handleStarredButtonClick (e) {
    let { filter } = this.state
    filter.type = 'STARRED'
    this.refs.list.resetScroll()
    this.setState({
      filter,
      index: 0
    }, () => {
      this.refs.search.focus()
    })
  }

  handleStorageButtonClick (e, storage) {
    let { filter } = this.state
    filter.type = 'STORAGE'
    filter.storage = storage
    this.refs.list.resetScroll()
    this.setState({
      filter,
      index: 0
    }, () => {
      this.refs.search.focus()
    })
  }

  handleFolderButtonClick (e, storage, folder) {
    let { filter } = this.state
    filter.type = 'FOLDER'
    filter.storage = storage
    filter.folder = folder
    this.refs.list.resetScroll()
    this.setState({
      filter,
      index: 0
    }, () => {
      this.refs.search.focus()
    })
  }

  handleNoteClick (e, index) {
    this.setState({
      index
    }, () => {
      this.refs.search.focus()
    })
  }

  render () {
    let { storages, notes, config } = this.props
    let { filter, search } = this.state
    let storageList = storages
      .map((storage) => <StorageSection
        filter={filter}
        storage={storage}
        key={storage.key}
        handleStorageButtonClick={(e, storage) => this.handleStorageButtonClick(e, storage)}
        handleFolderButtonClick={(e, storage, folder) => this.handleFolderButtonClick(e, storage, folder)}
      />)
    if (!filter.includeSnippet && filter.includeMarkdown) {
      notes = notes.filter((note) => note.type === 'MARKDOWN_NOTE')
    } else if (filter.includeSnippet && !filter.includeMarkdown) {
      notes = notes.filter((note) => note.type === 'SNIPPET_NOTE')
    }

    switch (filter.type) {
      case 'STORAGE':
        notes = notes.filter((note) => note.storage === filter.storage)
        break
      case 'FOLDER':
        notes = notes.filter((note) => note.storage === filter.storage && note.folder === filter.folder)
        break
      case 'STARRED':
        notes = notes.filter((note) => note.isStarred)
    }

    if (search.trim().length > 0) {
      let needle = new RegExp(_.escapeRegExp(search.trim()), 'i')
      notes = notes.filter((note) => note.title.match(needle))
    }

    let activeNote = notes[this.state.index]
    this.noteCount = notes.length

    return (
      <div className='Finder'
        styleName='root'
        ref='-1'
        onKeyDown={(e) => this.handleKeyDown(e)}
      >
        <div styleName='search'>
          <input
            styleName='search-input'
            ref='search'
            value={search}
            placeholder='Search...'
            onChange={(e) => this.handleSearchChange(e)}
          />
        </div>
        <div styleName='result'>
          <div styleName='result-nav'>
            <div styleName='result-nav-filter'>
              <div styleName='result-nav-filter-option'>
                <label>
                  <input type='checkbox'
                    checked={filter.includeSnippet}
                    onChange={(e) => this.handleOnlySnippetCheckboxChange(e)}
                  /> Only Snippets</label>
              </div>
              <div styleName='result-nav-filter-option'>
                <label>
                  <input type='checkbox'
                    checked={filter.includeMarkdown}
                    onChange={(e) => this.handleOnlyMarkdownCheckboxChange(e)}
                  /> Only Markdown</label>
              </div>
            </div>
            <button styleName={filter.type === 'ALL'
                ? 'result-nav-menu--active'
                : 'result-nav-menu'
              }
              onClick={(e) => this.handleAllNotesButtonClick(e)}
            ><i className='fa fa-files-o fa-fw'/> All Notes</button>
            <button styleName={filter.type === 'STARRED'
                ? 'result-nav-menu--active'
                : 'result-nav-menu'
              }
              onClick={(e) => this.handleStarredButtonClick(e)}
            ><i className='fa fa-star fa-fw'/> Starred</button>
            <div styleName='result-nav-storageList'>
              {storageList}
            </div>
          </div>
          <NoteList styleName='result-list'
            storages={storages}
            notes={notes}
            ref='list'
            search={search}
            index={this.state.index}
            handleNoteClick={(e, _index) => this.handleNoteClick(e, _index)}
          />
          <div styleName='result-detail'>
            <NoteDetail
              note={activeNote}
              config={config}
              ref='detail'
            />
          </div>
        </div>
      </div>
    )
  }
}

FinderMain.propTypes = {
  articles: PropTypes.array,
  activeArticle: PropTypes.shape({
    key: PropTypes.string,
    tags: PropTypes.array,
    title: PropTypes.string,
    content: PropTypes.string
  }),
  status: PropTypes.shape(),
  dispatch: PropTypes.func
}

var Finder = connect((x) => x)(CSSModules(FinderMain, styles))

function refreshData () {
  // let data = dataStore.getData(true)
}

ReactDOM.render((
  <Provider store={store}>
    <Finder/>
  </Provider>
), document.getElementById('content'), function () {
  refreshData()
})
