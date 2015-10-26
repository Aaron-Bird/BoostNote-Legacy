import React, { PropTypes } from 'react'
import ProfileImage from 'boost/components/ProfileImage'
import api from 'boost/api'

const IDLE = 'IDLE'
const DELETE = 'DELETE'

export default class MemberRow extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      mode: IDLE
    }
  }
  handleMemberRoleChange (e) {
    let input = {
      name: this.props.member.name,
      role: e.target.value
    }

    api.setMember(this.props.team.id, input)
      .then(res => {
        console.log(res.body)
      })
      .catch(err => {
        if (err.status != null) throw err
        else console.error(err)
      })
  }

  handleDeleteButtonClick (e) {
    this.setState({mode: DELETE})
  }

  handleCancelButtonClick (e) {
    this.setState({mode: IDLE})
  }

  handleDeleteConfirmButtonClick (e) {
    let input = {
      name: this.props.member.name
    }

    api.deleteMember(this.props.team.id, input)
      .then(res => {
        console.log(res.body)
      })
      .catch(err => {
        if (err.status != null) throw err
        else console.error(err)
      })
  }

  render () {
    let member = this.props.member
    let currentUser = this.props.currentUser
    let isDisabled = (currentUser.id === member.id)

    switch (this.state.mode) {
      case DELETE:
        return (
          <li className='MemberRow edit'>
            <div className='colDescription'>
              Are you sure to remove <strong>{member.profileName}</strong> ?
            </div>
            <div className='colDeleteConfirm'>
              <button className='deleteButton primary' onClick={e => this.handleDeleteConfirmButtonClick(e)}>Sure</button>
              <button className='deleteButton' onClick={e => this.handleCancelButtonClick(e)}>Cancel</button>
            </div>
          </li>
        )
      case IDLE:
      default:
        return (
          <li className='MemberRow'>
            <div className='colUserName'>
              <ProfileImage className='userPhoto' email={member.email} size='30'/>
              <div className='userInfo'>
                <div className='userName'>{`${member.profileName} (${member.name})`}</div>
                <div className='userEmail'>{member.email}</div>
              </div>
            </div>

            <div className='colRole'>
              <select onChange={e => this.handleMemberRoleChange(e)} disabled={isDisabled} value={member._pivot_role} className='userRole'>
                <option value='owner'>Owner</option>
                <option value='member'>Member</option>
              </select>
            </div>
            <div className='colDelete'>
              <button className='deleteButton' onClick={e => this.handleDeleteButtonClick(e)} disabled={isDisabled}><i className='fa fa-times fa-fw'/></button>
            </div>
          </li>
        )
    }
  }
}

MemberRow.propTypes = {
  member: PropTypes.shape(),
  currentUser: PropTypes.shape(),
  team: PropTypes.shape({
    id: PropTypes.number
  })
}
