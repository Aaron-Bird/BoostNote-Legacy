import React, { PropTypes} from 'react'
import { connect } from 'react-redux'
import { EDIT_MODE, IDLE_MODE, toggleTutorial } from 'boost/actions'
import ArticleNavigator from './HomePage/ArticleNavigator'
import ArticleTopBar from './HomePage/ArticleTopBar'
import ArticleList from './HomePage/ArticleList'
import ArticleDetail from './HomePage/ArticleDetail'
import _ from 'lodash'
import { isModalOpen, closeModal } from 'boost/modal'

const electron = require('electron')
const remote = electron.remote

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
    if (e.keyCode === 73 && e.metaKey && e.altKey) {
      e.preventDefault()
      e.stopPropagation()
      remote.getCurrentWebContents().openDevTools()
      return
    }

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
    if (top.isInputFocused() && !e.metaKey) {
      if (e.keyCode === 13 || e.keyCode === 27) top.escape()
      return
    }

    switch (status.mode) {

      case EDIT_MODE:
        if (e.keyCode === 27) {
          detail.handleCancelButtonClick()
        }
        if ((e.keyCode === 13 && e.metaKey) || (e.keyCode === 83 && e.metaKey)) {
          detail.handleSaveButtonClick()
        }
        if (e.keyCode === 80 && e.metaKey) {
          detail.handleTogglePreviewButtonClick()
        }
        if (e.keyCode === 78 && e.metaKey) {
          nav.handleNewPostButtonClick()
          e.preventDefault()
        }
        break
      case IDLE_MODE:
        if (e.keyCode === 69) {
          detail.handleEditButtonClick()
          e.preventDefault()
        }
        if (e.keyCode === 68) {
          detail.handleDeleteButtonClick()
        }

        // `detail`の`openDeleteConfirmMenu`の時。
        if (detail.state.openDeleteConfirmMenu) {
          if (e.keyCode === 27) {
            detail.handleDeleteCancelButtonClick()
          }
          if (e.keyCode === 13 && e.metaKey) {
            detail.handleDeleteConfirmButtonClick()
          }
          break
        }

        // `detail`の`openDeleteConfirmMenu`が`true`なら呼ばれない。
        if (e.keyCode === 27 || (e.keyCode === 70 && e.metaKey)) {
          top.focusInput()
        }

        if (e.keyCode === 38) {
          list.selectPriorArticle()
        }

        if (e.keyCode === 40) {
          list.selectNextArticle()
        }

        if ((e.keyCode === 65 && !e.metaKey && !e.ctrlKey) || (e.keyCode === 13 && e.metaKey) || (e.keyCode === 78 && e.metaKey)) {
          nav.handleNewPostButtonClick()
          e.preventDefault()
        }
    }
  }

  render () {
    let { dispatch, status, user, articles, allArticles, activeArticle, folders, tags, filters } = this.props

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
        />
        <ArticleList
          ref='list'
          dispatch={dispatch}
          folders={folders}
          articles={articles}
          status={status}
          activeArticle={activeArticle}
        />
        <ArticleDetail
          ref='detail'
          dispatch={dispatch}
          user={user}
          activeArticle={activeArticle}
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
  return target.match(new RegExp(_.escapeRegExp(needle)))
}

function startsWith (target, needle) {
  return target.match(new RegExp('^' + _.escapeRegExp(needle)))
}

function remap (state) {
  let { user, folders, articles, status } = state

  if (articles == null) articles = []
  articles.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })
  let allArticles = articles.slice()

  let tags = _.uniq(allArticles.reduce((sum, article) => {
    if (!_.isArray(article.tags)) return sum
    return sum.concat(article.tags)
  }, []))

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
    allArticles,
    articles,
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
