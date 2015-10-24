import React, { PropTypes } from 'react'
import ProfileImage from 'boost/components/ProfileImage'
import Select from 'react-select'
import api from 'boost/api'
import _ from 'lodash'

function getUsers (input, cb) {
  api.searchUser(input)
    .then(function (res) {
      let users = res.body

      cb(null, {
        options: users.map(user => {
          return { value: user.name, label: user.name }
        }),
        complete: false
      })
    })
    .catch(function (err) {
      console.error(err)
    })
}

export default class MemberSettingTab extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      newMember: ''
    }
  }

  getCurrentTeam (props) {
    if (props == null) props = this.props
    return _.findWhere(props.teams, {id: props.currentTeamId})
  }

  handleTeamSelectChange (e) {
    this.props.switchTeam(e.target.value)
  }

  handleNewMemberChange (value) {
    this.setState({newMember: value})
  }

  handleClickAddMemberButton (e) {
    let team = this.getCurrentTeam()
    if (team == null || team.userType !== 'team') return null

    let input = {
      name: this.state.newMember,
      role: 'member'
    }
    api.setMember(team.id, input)
      .then(res => {
        console.log(res.body)
      })
      .catch(err => {
        if (err.status != null) throw err
        else console.error(err)
      })
  }
  handleMemberRoleChange (name) {
    return e => {
      let team = this.getCurrentTeam()
      let input = {
        name: name,
        role: e.target.value
      }

      api.setMember(team.id, input)
        .then(res => {
          console.log(res.body)
        })
        .catch(err => {
          if (err.status != null) throw err
          else console.error(err)
        })
    }
  }

  handleMemberDeleteButtonClick (name) {
    return e => {
      let team = this.getCurrentTeam()
      let input = {
        name: name
      }

      api.deleteMember(team.id, input)
        .then(res => {
          console.log(res.body)
        })
        .catch(err => {
          if (err.status != null) throw err
          else console.error(err)
        })
    }
  }

  renderTeamOptions () {
    return this.props.teams.map(team => {
      return (
        <option key={'team-' + team.id} value={team.id}>{team.name}</option>)
    })
  }

  render () {
    console.log(this.props.teams)

    let team = this.getCurrentTeam()

    if (team == null || team.userType === 'person') {
      return this.renderNoTeam()
    }

    let membersEl = team.Members.map(member => {
      let isCurrentUser = this.props.currentUser.id === member.id

      return (
        <li key={'user-' + member.id}>
          <div className='colUserName'>
            <ProfileImage className='userPhoto' email={member.email} size='30'/>
            <div className='userInfo'>
              <div className='userName'>{`${member.profileName} (${member.name})`}</div>
              <div className='userEmail'>{member.email}</div>
            </div>
          </div>

          <div className='colRole'>
            <select onChange={e => this.handleMemberRoleChange(member.name)(e)} disabled={isCurrentUser} value={member._pivot_role} className='userRole'>
              <option value='owner'>Owner</option>
              <option value='member'>Member</option>
            </select>
            </div>
          <div className='colDelete'>
            <button className='deleteButton' onClick={e => this.handleMemberDeleteButtonClick(member.name)(e)} disabled={isCurrentUser}><i className='fa fa-times fa-fw'/></button>
          </div>
        </li>
      )
    })

    return (
      <div className='MemberSettingTab content'>
        <div className='header'>
          <span>Setting of</span>
          <select
            value={this.props.currentTeamId}
            onChange={e => this.handleTeamSelectChange(e)}
            className='teamSelect'>
            {this.renderTeamOptions()}
          </select>
        </div>

        <div className='membersTableSection section'>
          <div className='sectionTitle'>Members</div>
          <div className='addMember'>
            <div className='addMemberLabel'>Add member</div>
            <div className='addMemberControl'>
              <Select
                className='memberName'
                placeholder='Input username to add'
                autoload={false}
                asyncOptions={getUsers}
                onChange={val => this.handleNewMemberChange(val)}
                value={this.state.newMember}
              />
              <button onClick={e => this.handleClickAddMemberButton(e)} className='addMemberBtn'>add</button>
            </div>
          </div>
          <ul className='memberList'>
            <li className='header'>
              <div className='colUserName'>Username</div>
              <div className='colRole'>Role</div>
              <div className='colDelete'>Delete</div>
            </li>
            {membersEl}
          </ul>
        </div>
      </div>
    )
  }

  renderNoTeam () {
    return (
        <div className='TeamSettingTab content'>
          <div className='header'>
            <span>Setting of</span>
            <select
              value={this.props.currentTeamId}
              onChange={e => this.handleTeamSelectChange(e)}
              className='teamSelect'>
              {this.renderTeamOptions()}
            </select>
          </div>
          <div className='section'>Please select a team</div>
        </div>
    )
  }
}

MemberSettingTab.propTypes = {
  currentUser: PropTypes.shape(),
  teams: PropTypes.array,
  currentTeamId: PropTypes.number,
  switchTeam: PropTypes.func
}
