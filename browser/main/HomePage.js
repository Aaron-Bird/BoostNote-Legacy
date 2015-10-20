import React, { PropTypes} from 'react'
import { connect } from 'react-redux'
import { CREATE_MODE, IDLE_MODE, switchUser, NEW, refreshArticles } from 'boost/actions'
import UserNavigator from './HomePage/UserNavigator'
import ArticleNavigator from './HomePage/ArticleNavigator'
import ArticleTopBar from './HomePage/ArticleTopBar'
import ArticleList from './HomePage/ArticleList'
import ArticleDetail from './HomePage/ArticleDetail'
import { findWhere, findIndex, pick } from 'lodash'
import keygen from 'boost/keygen'
import api from 'boost/api'
import auth from 'boost/auth'
import io from 'boost/socket'

const TEXT_FILTER = 'TEXT_FILTER'
const FOLDER_FILTER = 'FOLDER_FILTER'

class HomePage extends React.Component {
  componentDidMount () {
    const { dispatch } = this.props

    dispatch(switchUser(this.props.params.userId))

    let currentUser = auth.user()

    let users = currentUser.Teams != null ? [currentUser].concat(currentUser.Teams) : [currentUser]
    users.forEach(user => {
      api.fetchArticles(user.id)
        .then(res => {
          dispatch(refreshArticles(user.id, res.body))
        })
        .catch(err => {
          if (err.status == null) throw err
          console.error(err)
        })
    })

    let token = auth.token()
    if (token != null) {
      io.emit('JOIN', {token})
    }
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch, status } = this.props

    if (nextProps.params.userId !== status.userId) {
      dispatch(switchUser(nextProps.params.userId))
    }
  }

  render () {
    const { dispatch, status, users, activeUser, articles, activeArticle } = this.props

    return (
      <div className='HomePage'>
        <UserNavigator users={users} />
        <ArticleNavigator dispatch={dispatch} activeUser={activeUser} status={status}/>
        <ArticleTopBar dispatch={dispatch} status={status}/>
        <ArticleList dispatch={dispatch} articles={articles} status={status} activeArticle={activeArticle}/>
        <ArticleDetail dispatch={dispatch} activeUser={activeUser} activeArticle={activeArticle} status={status}/>
      </div>
    )
  }
}

function remap (state) {
  let status = state.status

  let currentUser = state.currentUser
  if (currentUser == null) return state
  let teams = Array.isArray(currentUser.Teams) ? currentUser.Teams : []

  let users = [currentUser, ...teams]
  let activeUser = findWhere(users, {id: parseInt(status.userId, 10)})
  if (activeUser == null) activeUser = users[0]

  // Fetch articles
  let articles = state.articles['team-' + activeUser.id]
  if (articles == null) articles = []
  articles.sort((a, b) => {
    return new Date(b.updatedAt) - new Date(a.updatedAt)
  })

  // Filter articles
  let filters = status.search.split(' ').map(key => key.trim()).filter(key => key.length > 0).map(key => {
    if (key.match(/^in:.+$/)) {
      return {type: FOLDER_FILTER, value: key.match(/^in:(.+)$/)[1]}
    }
    return {type: TEXT_FILTER, value: key}
  })
  let folderFilters = filters.filter(filter => filter.type === FOLDER_FILTER)
  let textFilters = filters.filter(filter => filter.type === TEXT_FILTER)

  if (activeUser.Folders != null) {
    let targetFolders = activeUser.Folders.filter(folder => {
      return findWhere(folderFilters, {value: folder.name})
    })
    status.targetFolders = targetFolders

    if (targetFolders.length > 0) {
      articles = articles.filter(article => {
        return findWhere(targetFolders, {id: article.FolderId})
      })
    }
    if (textFilters.length > 0) {
      articles = textFilters.reduce((articles, textFilter) => {
        return articles.filter(article => {
          return article.title.match(new RegExp(textFilter.value, 'i')) || article.content.match(new RegExp(textFilter.value, 'i'))
        })
      }, articles)
    }
  }

  // Grab active article
  let activeArticle = findWhere(articles, {key: status.articleKey})
  if (activeArticle == null) activeArticle = articles[0]

  // remove Unsaved new article if user is not CREATE_MODE
  if (status.mode !== CREATE_MODE) {
    let targetIndex = findIndex(articles, article => article.status === NEW)

    if (targetIndex >= 0) articles.splice(targetIndex, 1)
  }

  // switching CREATE_MODE
  // restrict
  // 1. team have one folder at least
  // or Change IDLE MODE
  if (status.mode === CREATE_MODE && activeUser.Folders.length > 0) {
    var newArticle = findWhere(articles, {status: 'NEW'})
    if (newArticle == null) {
      newArticle = {
        id: null,
        key: keygen(),
        title: '',
        content: '',
        mode: 'markdown',
        Tags: [],
        User: pick(currentUser, ['email', 'name', 'profileName']),
        FolderId: activeUser.Folders[0].id,
        status: NEW
      }
      articles.unshift(newArticle)
    }
    activeArticle = newArticle
  } else if (status.mode === CREATE_MODE) {
    status.mode = IDLE_MODE
  }

  let props = {
    users,
    activeUser,
    status,
    articles,
    activeArticle
  }

  return props
}

HomePage.propTypes = {
  users: PropTypes.array,
  activeUser: PropTypes.object,
  params: PropTypes.shape({
    userId: PropTypes.string
  }),
  status: PropTypes.shape({
    userId: PropTypes.string
  }),
  articles: PropTypes.array,
  activeArticle: PropTypes.shape(),
  dispatch: PropTypes.func
}

export default connect(remap)(HomePage)
