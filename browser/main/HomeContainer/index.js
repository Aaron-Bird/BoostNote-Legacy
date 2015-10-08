import React from 'react'
// import { connect } from 'react-redux'
// import actionss....
import UserNavigator from './Components/UserNavigator'
import ArticleNavigator from './Components/ArticleNavigator'
import ArticleList from './Components/ArticleList'
import ArticleDetail from './Components/ArticleDetail'

// var AuthFilter = require('../Mixins/AuthFilter')
// var KeyCaster = require('../Mixins/KeyCaster')

class HomeContainer extends React.Component {
  componentDidMount () {
    // if (!this.isActive('user')) {
    //   console.log('redirect to user home')
    //   var user = JSON.parse(localStorage.getItem('currentUser'))
    //   this.transitionTo('userHome', {userId: user.id})
    // }
  }
  render () {
    let users = [
      {
        id: 1,
        name: 'me',
        email: 'fll@eme.com'
      },
      {
        id: 2,
        name: 'me',
        email: 'fll@eme.com'
      }
    ]
    return (
      <div className='HomeContainer'>
        <UserNavigator users={users} />
        <ArticleNavigator/>
        <ArticleList/>
        <ArticleDetail/>
      </div>
    )
  }
}

// function remap (state) {
//   console.log('mapped')
//   console.log(state)
//   return {}
// }

export default HomeContainer
