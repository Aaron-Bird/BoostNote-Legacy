import React, { PropTypes} from 'react'
import { connect } from 'react-redux'
import { switchUser } from './actions'
import UserNavigator from './Components/UserNavigator'
import ArticleNavigator from './Components/ArticleNavigator'
import ArticleTopBar from './Components/ArticleTopBar'
import ArticleList from './Components/ArticleList'
import ArticleDetail from './Components/ArticleDetail'
import { findWhere } from 'lodash'

// var AuthFilter = require('../Mixins/AuthFilter')
// var KeyCaster = require('../Mixins/KeyCaster')

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
    const { users, user, status, articles, article } = this.props

    return (
      <div className='HomeContainer'>
        <UserNavigator users={users} />
        <ArticleNavigator user={user} status={status}/>
        <ArticleTopBar/>
        <ArticleList articles={articles} status={status}/>
        <ArticleDetail user={user} article={article} status={status}/>
      </div>
    )
  }
}

function remap (state) {
  let status = state.status

  let currentUser = state.currentUser
  let teams = Array.isArray(currentUser.Teams) ? currentUser.Teams : []

  let users = [currentUser, ...teams]
  let user = findWhere(users, {id: parseInt(status.userId, 10)})
  if (user == null) user = users[0]
  let articles = state.articles['team-' + user.id]
  let article = findWhere(users, {id: status.articleId})
  if (article == null) article = articles[0]

  return {
    users,
    user,
    status,
    articles,
    article
  }
}

HomeContainer.propTypes = {
  users: PropTypes.array,
  user: PropTypes.object,
  params: PropTypes.shape({
    userId: PropTypes.string
  }),
  status: PropTypes.shape({
    userId: PropTypes.string,
    folderId: PropTypes.number
  }),
  articles: PropTypes.array,
  dispatch: PropTypes.func
}

export default connect(remap)(HomeContainer)
