import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import ProfileImage from '../../components/ProfileImage'
import { openModal } from '../lib/modal'
import CreateNewTeam from '../lib/modal/CreateNewTeam'

export default class UserNavigator extends Component {
  handleClick (e) {
    openModal(CreateNewTeam)
  }

  // for dev
  componentDidMount () {
    openModal(CreateNewTeam)
  }

  renderUserList () {
    var users = this.props.users.map((user, index) => (
      <li key={'user-' + user.id}>
        <Link to={'/users/' + user.id} activeClassName='active'>
          <ProfileImage email={user.email} size='44'/>
          <div className='userTooltip'>{user.name}</div>
          {index < 9 ? <div className='keyLabel'>{'⌘' + (index + 1)}</div> : null}
        </Link>
      </li>
    ))

    return (
      <ul className='userList'>
        {users}
      </ul>
    )
  }

  render () {
    return (
      <div className='UserNavigator'>
        {this.renderUserList()}
        <button className='createTeamBtn' onClick={e => this.handleClick(e)}>
          +
          <div className='tooltip'>Create a new team</div>
        </button>
      </div>
    )
  }
}

UserNavigator.propTypes = {
  users: PropTypes.array
}
