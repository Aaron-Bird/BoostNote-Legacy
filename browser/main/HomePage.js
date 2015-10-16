import React, { PropTypes} from 'react'
import { connect } from 'react-redux'
import { CREATE_MODE, IDLE_MODE, switchUser } from './actions'
import UserNavigator from './HomePage/UserNavigator'
import ArticleNavigator from './HomePage/ArticleNavigator'
import ArticleTopBar from './HomePage/ArticleTopBar'
import ArticleList from './HomePage/ArticleList'
import ArticleDetail from './HomePage/ArticleDetail'
import { findWhere, findIndex, pick } from 'lodash'
import keygen from 'boost/keygen'
import { NEW, refreshArticles } from './actions'
import api from 'boost/api'

class HomePage extends React.Component {
  componentDidMount () {
    const { dispatch } = this.props

    dispatch(switchUser(this.props.params.userId))

    let currentUser = JSON.parse(localStorage.getItem('currentUser'))
    let users = [currentUser].concat(currentUser.Teams)
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
        <ArticleTopBar/>
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

  let articles = state.articles['team-' + activeUser.id]
  if (articles == null) articles = []

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
  console.log(props)
  return props
}

HomePage.propTypes = {
  users: PropTypes.array,
  activeUser: PropTypes.object,
  params: PropTypes.shape({
    userId: PropTypes.string
  }),
  status: PropTypes.shape({
    userId: PropTypes.string,
    folderId: PropTypes.number
  }),
  articles: PropTypes.array,
  activeArticle: PropTypes.shape(),
  dispatch: PropTypes.func
}

export default connect(remap)(HomePage)
