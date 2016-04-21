import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect, Provider } from 'react-redux'
import reducer from './reducer'
import { createStore } from 'redux'
import FinderInput from './FinderInput'
import FinderList from './FinderList'
import FinderDetail from './FinderDetail'
import actions, { selectArticle, searchArticle } from './actions'
import _ from 'lodash'
import dataStore from 'browser/lib/dataStore'
import fetchConfig from '../lib/fetchConfig'
const electron = require('electron')
const { clipboard, ipcRenderer, remote } = electron
const path = require('path')

let config = fetchConfig()
applyConfig(config)

ipcRenderer.on('config-apply', function (e, newConfig) {
  config = newConfig
  applyConfig(config)
})

function applyConfig () {
  let body = document.body
  body.setAttribute('data-theme', config['theme-ui'])

  let hljsCss = document.getElementById('hljs-css')
  hljsCss.setAttribute('href', '../node_modules/highlight.js/styles/' + config['theme-code'] + '.css')
}

if (process.env.NODE_ENV !== 'production') {
  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 73 && e.metaKey && e.altKey) {
      remote.getCurrentWindow().toggleDevTools()
    }
  })
}

function hideFinder () {
  ipcRenderer.send('hide-finder')
}

function notify (title, options) {
  if (process.platform === 'win32') {
    options.icon = path.join('file://', global.__dirname, '../../resources/app.png')
  }
  return new window.Notification(title, options)
}

require('../styles/finder/index.styl')

const FOLDER_FILTER = 'FOLDER_FILTER'
const FOLDER_EXACT_FILTER = 'FOLDER_EXACT_FILTER'
const TEXT_FILTER = 'TEXT_FILTER'
const TAG_FILTER = 'TAG_FILTER'

class FinderMain extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.keyDownHandler = e => this.handleKeyDown(e)
    document.addEventListener('keydown', this.keyDownHandler)
    ReactDOM.findDOMNode(this.refs.finderInput.refs.input).focus()
    this.focusHandler = e => {
      let { dispatch } = this.props

      dispatch(searchArticle(''))
      dispatch(selectArticle(null))
    }
    window.addEventListener('focus', this.focusHandler)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.keyDownHandler)
    window.removeEventListener('focus', this.focusHandler)
  }

  handleKeyDown (e) {
    if (e.keyCode === 38) {
      this.selectPrevious()
      e.preventDefault()
    }

    if (e.keyCode === 40) {
      this.selectNext()
      e.preventDefault()
    }

    if (e.keyCode === 13) {
      this.saveToClipboard()
      e.preventDefault()
    }
    if (e.keyCode === 27) {
      hideFinder()
      e.preventDefault()
    }
    if (e.keyCode === 91 || e.metaKey) {
      return
    }

    ReactDOM.findDOMNode(this.refs.finderInput.refs.input).focus()
  }

  saveToClipboard () {
    let { activeArticle } = this.props
    clipboard.writeText(activeArticle.content)

    ipcRenderer.send('copy-finder')
    notify('Saved to Clipboard!', {
      body: 'Paste it wherever you want!',
      silent: true
    })
    hideFinder()
  }

  handleSearchChange (e) {
    let { dispatch } = this.props

    dispatch(searchArticle(e.target.value))
  }

  selectArticle (article) {
    this.setState({currentArticle: article})
  }

  selectPrevious () {
    let { activeArticle, dispatch } = this.props
    let index = this.refs.finderList.props.articles.indexOf(activeArticle)
    let previousArticle = this.refs.finderList.props.articles[index - 1]
    if (previousArticle != null) dispatch(selectArticle(previousArticle.key))
  }

  selectNext () {
    let { activeArticle, dispatch } = this.props
    let index = this.refs.finderList.props.articles.indexOf(activeArticle)
    let previousArticle = this.refs.finderList.props.articles[index + 1]
    if (previousArticle != null) dispatch(selectArticle(previousArticle.key))
  }

  render () {
    let { articles, activeArticle, status, dispatch } = this.props
    let saveToClipboard = () => this.saveToClipboard()
    return (
      <div className='Finder'>
        <FinderInput
          handleSearchChange={e => this.handleSearchChange(e)}
          ref='finderInput'
          onChange={this.handleChange}
          value={status.search}
        />
        <FinderList
          ref='finderList'
          activeArticle={activeArticle}
          articles={articles}
          dispatch={dispatch}
          selectArticle={article => this.selectArticle(article)}
        />
        <FinderDetail
          activeArticle={activeArticle}
          saveToClipboard={saveToClipboard}
        />
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

// Ignore invalid key
function ignoreInvalidKey (key) {
  return key.length > 0 && !key.match(/^\/\/$/) && !key.match(/^\/$/) && !key.match(/^#$/)
}

// Build filter object by key
function buildFilter (key) {
  if (key.match(/^\/\/.+/)) {
    return {type: FOLDER_EXACT_FILTER, value: key.match(/^\/\/(.+)$/)[1]}
  }
  if (key.match(/^\/.+/)) {
    return {type: FOLDER_FILTER, value: key.match(/^\/(.+)$/)[1]}
  }
  if (key.match(/^#(.+)/)) {
    return {type: TAG_FILTER, value: key.match(/^#(.+)$/)[1]}
  }
  return {type: TEXT_FILTER, value: key}
}

function isContaining (target, needle) {
  return target.match(new RegExp(_.escapeRegExp(needle), 'i'))
}

function startsWith (target, needle) {
  return target.match(new RegExp('^' + _.escapeRegExp(needle), 'i'))
}

function remap (state) {
  let { articles, folders, status } = state

  let filters = status.search.split(' ')
    .map(key => key.trim())
    .filter(ignoreInvalidKey)
    .map(buildFilter)

  let folderExactFilters = filters.filter(filter => filter.type === FOLDER_EXACT_FILTER)
  let folderFilters = filters.filter(filter => filter.type === FOLDER_FILTER)
  let textFilters = filters.filter(filter => filter.type === TEXT_FILTER)
  let tagFilters = filters.filter(filter => filter.type === TAG_FILTER)

  let targetFolders
  if (folders != null) {
    let exactTargetFolders = folders.filter(folder => {
      return _.find(folderExactFilters, filter => filter.value.toLowerCase() === folder.name.toLowerCase())
    })
    let fuzzyTargetFolders = folders.filter(folder => {
      return _.find(folderFilters, filter => startsWith(folder.name.replace(/_/g, ''), filter.value.replace(/_/g, '')))
    })
    targetFolders = status.targetFolders = exactTargetFolders.concat(fuzzyTargetFolders)

    if (targetFolders.length > 0) {
      articles = articles.filter(article => {
        return _.findWhere(targetFolders, {key: article.FolderKey})
      })
    }

    if (textFilters.length > 0) {
      articles = textFilters.reduce((articles, textFilter) => {
        return articles.filter(article => {
          return isContaining(article.title, textFilter.value) || isContaining(article.content, textFilter.value)
        })
      }, articles)
    }

    if (tagFilters.length > 0) {
      articles = tagFilters.reduce((articles, tagFilter) => {
        return articles.filter(article => {
          return _.find(article.tags, tag => isContaining(tag, tagFilter.value))
        })
      }, articles)
    }
  }

  let activeArticle = _.findWhere(articles, {key: status.articleKey})
  if (activeArticle == null) activeArticle = articles[0]

  return {
    articles,
    activeArticle,
    status
  }
}

var Finder = connect(remap)(FinderMain)
var store = createStore(reducer)

function refreshData () {
  let data = dataStore.getData(true)
  store.dispatch(actions.refreshData(data))
}

window.onfocus = e => {
  refreshData()
}

ReactDOM.render((
  <Provider store={store}>
    <Finder/>
  </Provider>
), document.getElementById('content'), function () {
  refreshData()
})
