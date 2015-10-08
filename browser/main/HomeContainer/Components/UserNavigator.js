import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class UserNavigator extends Component {

  renderUserList () {
    var users = this.props.users.map(user => (
      <li key={'user-' + user.id}>
        <Link to={'/users/' + user.id}>
          <div className='userTooltip'>{user.name}</div>
        </Link>
      </li>
    ))

    return (
      <div className='userList'>
        {users}
      </div>
    )
  }

  render () {
    return (
      <div className='UserNavigator'>
        {this.renderUserList()}
      </div>
    )
  }
}

UserNavigator.propTypes = {
  users: PropTypes.array
}
