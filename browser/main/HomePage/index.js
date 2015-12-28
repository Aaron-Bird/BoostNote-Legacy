import React, { PropTypes} from 'react'
import { connect } from 'react-redux'
import { toggleTutorial } from '../actions'
import ArticleNavigator from './ArticleNavigator'
import ArticleTopBar from './ArticleTopBar'
import ArticleList from './ArticleList'
import ArticleDetail from './ArticleDetail'
import _ from 'lodash'
import { isModalOpen, closeModal } from 'browser/lib/modal'

const TEXT_FILTER = 'TEXT_FILTER'
const FOLDER_FILTER = 'FOLDER_FILTER'
const FOLDER_EXACT_FILTER = 'FOLDER_EXACT_FILTER'
const TAG_FILTER = 'TAG_FILTER'

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
    let cmdOrCtrl = process.platform === 'darwin' ? e.metaKey : e.ctrlKey

    if (isModalOpen()) {
      if (e.keyCode === 27) closeModal()
      return
    }

    let { status, dispatch } = this.props
    let { nav, top, list, detail } = this.refs

    if (status.isTutorialOpen) {
      dispatch(toggleTutorial())
      e.preventDefault()
      return
    }

    // Search inputがfocusされていたら大体のキー入力は無視される。
    if (top.isInputFocused() && !(e.metaKey || e.ctrlKey)) {
      if (e.keyCode === 13 || e.keyCode === 27) top.escape()
      return
    }

    // `detail`の`openDeleteConfirmMenu`が`true`なら呼ばれない。
    if (e.keyCode === 27 || (e.keyCode === 70 && cmdOrCtrl)) {
      top.focusInput()
    }

    if (e.keyCode === 38) {
      list.selectPriorArticle()
    }

    if (e.keyCode === 40) {
      list.selectNextArticle()
    }

    if (e.keyCode === 78 && cmdOrCtrl) {
      nav.handleNewPostButtonClick()
      e.preventDefault()
    }
  }

  render () {
    let { dispatch, status, user, articles, allArticles, modified, activeArticle, folders, tags, filters } = this.props

    return (
      <div className='HomePage'>
        <ArticleNavigator
          ref='nav'
          dispatch={dispatch}
          user={user}
          folders={folders}
          status={status}
          allArticles={allArticles}
        />
        <ArticleTopBar
          ref='top'
          dispatch={dispatch}
          status={status}
          modified={modified}
        />
        <ArticleList
          ref='list'
          dispatch={dispatch}
          folders={folders}
          articles={articles}
          modified={modified}
          status={status}
          activeArticle={activeArticle}
        />
        <ArticleDetail
          ref='detail'
          dispatch={dispatch}
          user={user}
          activeArticle={activeArticle}
          modified={modified}
          folders={folders}
          status={status}
          tags={tags}
          filters={filters}
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
  return target.match(new RegExp(_.escapeRegExp(needle)))
}

function startsWith (target, needle) {
  return target.match(new RegExp('^' + _.escapeRegExp(needle)))
}

function remap (state) {
  let { user, folders, status } = state
  let _articles = state.articles

  let articles = _articles != null ? _articles.data : []
  let modified = _articles != null ? _articles.modified : []

  articles.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt)
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
      return _.findWhere(folderExactFilters, {value: folder.name})
    })
    let fuzzyTargetFolders = folders.filter(folder => {
      return _.find(folderFilters, filter => startsWith(folder.name, filter.value))
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

  return {
    user,
    folders,
    status,
    articles,
    allArticles,
    modified,
    activeArticle,
    tags,
    filters: {
      folder: folderFilters,
      tag: tagFilters,
      text: textFilters
    }
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
  filters: PropTypes.shape({
    folder: PropTypes.array,
    tag: PropTypes.array,
    text: PropTypes.array
  }),
  tags: PropTypes.array
}

export default connect(remap)(HomePage)
