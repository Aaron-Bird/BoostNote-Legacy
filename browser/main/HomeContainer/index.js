import React, { PropTypes} from 'react'
import { connect } from 'react-redux'
import { switchParams } from './actions'
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
    const { dispatch, params } = this.props
    console.log(params)
    dispatch(switchParams(params))
  }

  componentWillReceiveProps (nextProps) {
    const { dispatch } = this.props
    if (nextProps.params.userId !== this.props.params.userId) {
      let params = nextProps.params
      dispatch(switchParams(params))
    }
  }

  render () {
    const { users, user } = this.props

    return (
      <div className='HomeContainer'>
        <UserNavigator users={users} />
        <ArticleNavigator user={user}/>
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
  let user = findWhere(users, {id: parseInt(state.params.userId, 10)})

  return {
    users,
    user
  }
}

HomeContainer.propTypes = {
  users: PropTypes.array,
  user: PropTypes.object,
  params: PropTypes.shape({
    userId: PropTypes.string
  }),
  dispatch: PropTypes.func
}

export default connect(remap)(HomeContainer)
