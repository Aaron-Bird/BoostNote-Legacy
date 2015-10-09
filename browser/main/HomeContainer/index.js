import React, { PropTypes} from 'react'
import { connect } from 'react-redux'
// import actionss....
import UserNavigator from './Components/UserNavigator'
import ArticleNavigator from './Components/ArticleNavigator'
import ArticleTopBar from './Components/ArticleTopBar'
import ArticleList from './Components/ArticleList'
import ArticleDetail from './Components/ArticleDetail'

// var AuthFilter = require('../Mixins/AuthFilter')
// var KeyCaster = require('../Mixins/KeyCaster')

class HomeContainer extends React.Component {
  render () {
    const { users } = this.props
    return (
      <div className='HomeContainer'>
        <UserNavigator users={users} />
        <ArticleNavigator/>
        <ArticleTopBar/>
        <ArticleList/>
        <ArticleDetail/>
      </div>
    )
  }
}

function remap (state) {
  let currentUser = state.currentUser
  let teams = Array.isArray(currentUser.Teams) ? currentUser.Teams : []

  let users = [currentUser, ...teams]

  return {
    users
  }
}

HomeContainer.propTypes = {
  users: PropTypes.array
}

export default connect(remap, {})(HomeContainer)
