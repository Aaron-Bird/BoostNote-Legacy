import React, { PropTypes} from 'react'
import { connect } from 'react-redux'
import ReactDOM from 'react-dom'
import { toggleTutorial } from '../actions'
import SideNav from './SideNav'
import ArticleTopBar from './ArticleTopBar'
import ArticleList from './ArticleList'
import ArticleDetail from './ArticleDetail'
import _ from 'lodash'
import { isModalOpen, closeModal } from 'browser/lib/modal'

const electron = require('electron')
const remote = electron.remote

const TEXT_FILTER = 'TEXT_FILTER'
const FOLDER_FILTER = 'FOLDER_FILTER'
const FOLDER_EXACT_FILTER = 'FOLDER_EXACT_FILTER'
const TAG_FILTER = 'TAG_FILTER'

const OSX = global.process.platform === 'darwin'

class HomePage extends React.Component {
  componentDidMount () {
    // React自体のKey入力はfocusされていないElementからは動かないため、
    // `window`に直接かける
    this.keyHandler = e => this.handleKeyDown(e)
    window.addEventListener('keydown', this.keyHandler)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.keyHandler)
  }

  handleKeyDown (e) {
    if (isModalOpen()) {
      if (e.keyCode === 13 && (OSX ? e.metaKey : e.ctrlKey)) {
        remote.getCurrentWebContents().send('modal-confirm')
      }
      if (e.keyCode === 27) closeModal()
      return
    }

    let { status, dispatch } = this.props
    let { top, list } = this.refs
    let listElement = ReactDOM.findDOMNode(list)

    if (status.isTutorialOpen) {
      dispatch(toggleTutorial())
      e.preventDefault()
      return
    }

    if (e.keyCode === 13 && top.isInputFocused()) {
      listElement.focus()
      return
    }
    if (e.keyCode === 27 && top.isInputFocused()) {
      if (status.search.length > 0) top.escape()
      else listElement.focus()
      return
    }

    // Search inputがfocusされていたら大体のキー入力は無視される。
    if (e.keyCode === 27) {
      if (document.activeElement !== listElement) {
        listElement.focus()
      } else {
        top.focusInput()
      }
      return
    }
  }

  render () {
    let { dispatch, status, user, articles, allArticles, modified, activeArticle, folders, tags } = this.props
    let { repositories } = this.props

    return (
      <div className='HomePage'>
        <SideNav
          ref='nav'
          dispatch={dispatch}
          repositories={repositories}
          status={status}
          user={user}
          folders={folders}
          allArticles={allArticles}
          articles={articles}
          modified={modified}
          activeArticle={activeArticle}
        />
        <ArticleTopBar
          ref='top'
          dispatch={dispatch}
          status={status}
          folders={folders}
        />
        <ArticleList
          ref='list'
          dispatch={dispatch}
          folders={folders}
          articles={articles}
          modified={modified}
          activeArticle={activeArticle}
        />
        <ArticleDetail
          ref='detail'
          dispatch={dispatch}
          status={status}
          tags={tags}
          user={user}
          folders={folders}
          modified={modified}
          activeArticle={activeArticle}
        />
      </div>
    )
  }
}

// Ignore invalid key
function ignoreInvalidKey (key) {
  return key.length > 0 && !key.match(/^\/\/$/) && !key.match(/^\/$/) && !key.match(/^#$/) && !key.match(/^--/)
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
  let { user, folders, status } = state
  let _articles = state.articles

  let articles = _articles != null ? _articles.data : []
  let modified = _articles != null ? _articles.modified : []

  articles.sort((a, b) => {
    let match = new Date(b.updatedAt) - new Date(a.updatedAt)
    if (match === 0) match = b.title.localeCompare(a.title)
    if (match === 0) match = b.key.localeCompare(a.key)
    return match
  })
  let allArticles = articles.slice()

  let tags = _.uniq(allArticles.reduce((sum, article) => {
    if (!_.isArray(article.tags)) return sum
    return sum.concat(article.tags)
  }, []))

  if (status.search.split(' ').some(key => key === '--unsaved')) articles = articles.filter(article => _.findWhere(modified, {key: article.key}))
  // Filter articles
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

  // Grab active article
  let activeArticle = _.findWhere(articles, {key: status.articleKey})
  if (activeArticle == null) activeArticle = articles[0]

  let { repositories } = state

  return {
    user,
    folders,
    status,
    articles,
    allArticles,
    modified,
    activeArticle,
    tags,
    repositories
  }
}

HomePage.propTypes = {
  status: PropTypes.shape(),
  user: PropTypes.shape({
    name: PropTypes.string
  }),
  articles: PropTypes.array,
  allArticles: PropTypes.array,
  modified: PropTypes.array,
  activeArticle: PropTypes.shape(),
  dispatch: PropTypes.func,
  folders: PropTypes.array,
  tags: PropTypes.array,
  repositories: PropTypes.array
}

export default connect(remap)(HomePage)
