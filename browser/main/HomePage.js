import React, { PropTypes} from 'react'
import { connect } from 'react-redux'
import { CREATE_MODE, IDLE_MODE, switchUser } from './actions'
import UserNavigator from './HomePage/UserNavigator'
import ArticleNavigator from './HomePage/ArticleNavigator'
import ArticleTopBar from './HomePage/ArticleTopBar'
import ArticleList from './HomePage/ArticleList'
import ArticleDetail from './HomePage/ArticleDetail'
import { findWhere, pick } from 'lodash'
import keygen from 'boost/keygen'
import { NEW } from './actions'

class HomeContainer extends React.Component {
  componentDidMount () {
    const { dispatch } = this.props

    dispatch(switchUser(this.props.params.userId))
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
      <div className='HomeContainer'>
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
  let teams = Array.isArray(currentUser.Teams) ? currentUser.Teams : []

  let users = [currentUser, ...teams]
  let activeUser = findWhere(users, {id: parseInt(status.userId, 10)})
  if (activeUser == null) activeUser = users[0]
  let articles = state.articles['team-' + activeUser.id]
  let activeArticle = findWhere(users, {id: status.articleId})
  if (activeArticle == null) activeArticle = articles[0]

  if (status.mode === CREATE_MODE && activeUser.Folders.length > 0) {
    var newArticle = findWhere(articles, {status: 'NEW'})
    if (newArticle == null) {
      newArticle = {
        id: keygen(),
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
  if (status.mode !== CREATE_MODE && activeArticle != null && activeArticle.status === NEW) {
    articles.splice(articles.indexOf(activeArticle), 1)
    activeArticle = articles[0]
  }

  return {
    users,
    activeUser,
    status,
    articles,
    activeArticle
  }
}

HomeContainer.propTypes = {
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

export default connect(remap)(HomeContainer)
