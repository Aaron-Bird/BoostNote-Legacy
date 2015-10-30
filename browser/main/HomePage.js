import React, { PropTypes} from 'react'
import { connect } from 'react-redux'
import { CREATE_MODE, IDLE_MODE, NEW } from 'boost/actions'
// import UserNavigator from './HomePage/UserNavigator'
import ArticleNavigator from './HomePage/ArticleNavigator'
import ArticleTopBar from './HomePage/ArticleTopBar'
import ArticleList from './HomePage/ArticleList'
import ArticleDetail from './HomePage/ArticleDetail'
import _ from 'lodash'
import keygen from 'boost/keygen'

const TEXT_FILTER = 'TEXT_FILTER'
const FOLDER_FILTER = 'FOLDER_FILTER'
const TAG_FILTER = 'TAG_FILTER'

class HomePage extends React.Component {
  render () {
    let { dispatch, status, articles, activeArticle, folders } = this.props

    return (
      <div className='HomePage'>
        <ArticleNavigator
          dispatch={dispatch}
          folders={folders}
          status={status}
        />
        <ArticleTopBar dispatch={dispatch} status={status}/>
        <ArticleList
          dispatch={dispatch}
          folders={folders}
          articles={articles}
          status={status}
          activeArticle={activeArticle}
        />
        <ArticleDetail
          dispatch={dispatch}
          activeArticle={activeArticle}
          folders={folders}
          status={status}
        />
      </div>
    )
  }
}

function remap (state) {
  let status = state.status
  // Fetch articles
  let data = JSON.parse(localStorage.getItem('local'))
  let { folders, articles } = data
  if (articles == null) articles = []
  articles.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })

  // Filter articles
  let filters = status.search.split(' ').map(key => key.trim()).filter(key => key.length > 0 && !key.match(/^#$/)).map(key => {
    if (key.match(/^in:.+$/)) {
      return {type: FOLDER_FILTER, value: key.match(/^in:(.+)$/)[1]}
    }
    if (key.match(/^#(.+)/)) {
      return {type: TAG_FILTER, value: key.match(/^#(.+)$/)[1]}
    }
    return {type: TEXT_FILTER, value: key}
  })
  let folderFilters = filters.filter(filter => filter.type === FOLDER_FILTER)
  let textFilters = filters.filter(filter => filter.type === TEXT_FILTER)
  let tagFilters = filters.filter(filter => filter.type === TAG_FILTER)

  if (folders != null) {
    let targetFolders = folders.filter(folder => {
      return _.findWhere(folderFilters, {value: folder.name})
    })
    status.targetFolders = targetFolders

    if (targetFolders.length > 0) {
      articles = articles.filter(article => {
        return _.findWhere(targetFolders, {key: article.FolderKey})
      })
    }

    if (textFilters.length > 0) {
      articles = textFilters.reduce((articles, textFilter) => {
        return articles.filter(article => {
          return article.title.match(new RegExp(textFilter.value, 'i')) || article.content.match(new RegExp(textFilter.value, 'i'))
        })
      }, articles)
    }

    if (tagFilters.length > 0) {
      articles = tagFilters.reduce((articles, tagFilter) => {
        return articles.filter(article => {
          return _.find(article.tags, tag => tag.match(new RegExp(tagFilter.value, 'i')))
        })
      }, articles)
    }
  }

  // Grab active article
  let activeArticle = _.findWhere(articles, {key: status.articleKey})
  if (activeArticle == null) activeArticle = articles[0]

  // remove Unsaved new article if user is not CREATE_MODE
  if (status.mode !== CREATE_MODE) {
    let targetIndex = _.findIndex(articles, article => article.status === NEW)

    if (targetIndex >= 0) articles.splice(targetIndex, 1)
  }

  // switching CREATE_MODE
  // restrict
  // 1. team have one folder at least
  // or Change IDLE MODE
  if (status.mode === CREATE_MODE) {
    var newArticle = _.findWhere(articles, {status: 'NEW'})
    if (newArticle == null) {
      newArticle = {
        id: null,
        key: keygen(),
        title: '',
        content: '',
        mode: 'markdown',
        tags: [],
        FolderKey: folders[0].key,
        status: NEW
      }
      articles.unshift(newArticle)
    }
    activeArticle = newArticle
  } else if (status.mode === CREATE_MODE) {
    status.mode = IDLE_MODE
  }

  let props = {
    folders,
    status,
    articles,
    activeArticle
  }

  return props
}

HomePage.propTypes = {
  params: PropTypes.shape({
    userId: PropTypes.string
  }),
  status: PropTypes.shape({
    userId: PropTypes.string
  }),
  articles: PropTypes.array,
  activeArticle: PropTypes.shape(),
  dispatch: PropTypes.func,
  folders: PropTypes.array
}

export default connect(remap)(HomePage)
