import React, { PropTypes } from 'react'
import ProfileImage from 'boost/components/ProfileImage'
import { searchUser, createTeam, setMember, deleteMember } from 'boost/api'
import linkState from 'boost/linkState'
import Select from 'react-select'

function getUsers (input, cb) {
  searchUser(input)
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

export default class CreateNewTeam extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      create: {
        name: '',
        alert: null
      },
      select: {
        team: null,
        newMember: null,
        alert: null
      },
      currentTab: 'create',
      currentUser: JSON.parse(localStorage.getItem('currentUser'))
    }
  }

  handleCloseClick (e) {
    this.props.close()
  }

  handleContinueClick (e) {
    let createState = this.state.create
    createState.isSending = true
    createState.alert = {
      type: 'info',
      message: 'sending...'
    }
    this.setState({create: createState})

    function onTeamCreate (res) {
      let createState = this.state.create
      createState.isSending = false
      createState.alert = null

      let selectState = this.state.select
      selectState.team = res.body

      this.setState({
        currentTab: 'select',
        create: createState,
        select: {
          team: res.body
        }
      })
    }

    function onError (err) {
      let errorMessage = err.response != null ? err.response.body.message : 'Can\'t connect to API server.'

      let createState = this.state.create
      createState.isSending = false
      createState.alert = {
        type: 'error',
        message: errorMessage
      }

      this.setState({
        create: createState
      })
    }

    createTeam({name: this.state.create.name})
      .then(onTeamCreate.bind(this))
      .catch(onError.bind(this))
  }

  renderCreateTab () {
    let createState = this.state.create
    let alertEl = createState.alert != null ? (
      <p className={['alert'].concat([createState.alert.type]).join(' ')}>{createState.alert.message}</p>
    ) : null

    return (
      <div className='createTab'>
        <div className='title'>Create new team</div>

        <input valueLink={this.linkState('create.name')} className='ipt' type='text' placeholder='Enter your team name'/>
        {alertEl}
        <button onClick={e => this.handleContinueClick(e)} disabled={createState.isSending} className='confirmBtn'>Continue <i className='fa fa-arrow-right fa-fw'/></button>
      </div>
    )
  }
  handleNewMemberChange (value) {
    let selectState = this.state.select
    selectState.newMember = value
    this.setState({select: selectState})
  }

  handleClickAddMemberButton (e) {
    let selectState = this.state.select
    let input = {
      name: selectState.newMember,
      role: 'member'
    }

    setMember(selectState.team.id, input)
      .then(res => {
        let selectState = this.state.select
        let team = res.body
        team.Members = team.Members.sort((a, b) => {
          return new Date(a._pivot_createdAt) - new Date(b._pivot_createdAt)
        })
        selectState.team = team
        selectState.newMember = ''

        this.setState({select: selectState})
      })
      .catch(err => {
        if (err.status != null) throw err
        else console.error(err)
      })
  }

  handleMemberDeleteButtonClick (name) {
    let selectState = this.state.select
    let input = {
      name: name
    }

    return e => {
      deleteMember(selectState.team.id, input)
        .then(res => {
          let selectState = this.state.select
          let team = res.body
          team.Members = team.Members.sort((a, b) => {
            return new Date(a._pivot_createdAt) - new Date(b._pivot_createdAt)
          })
          selectState.team = team
          selectState.newMember = ''

          this.setState({select: selectState})
        })
        .catch(err => {
          console.log(err, err.response)
          if (err.status != null) throw err
          else console.error(err)
        })
    }
  }

  handleMemberRoleChange (name) {
    return function (e) {
      let selectState = this.state.select
      let input = {
        name: name,
        role: e.target.value
      }

      setMember(selectState.team.id, input)
        .then(res => {
          console.log(res.body)
        })
        .catch(err => {
          if (err.status != null) throw err
          else console.error(err)
        })
    }.bind(this)
  }

  renderSelectTab () {
    let selectState = this.state.select

    let membersEl = selectState.team.Members.map(member => {
      let isCurrentUser = this.state.currentUser.id === member.id

      return (
        <li key={'user-' + member.id}>
          <ProfileImage className='userPhoto' email={member.email} size='30'/>
          <div className='userInfo'>
            <div className='userName'>{`${member.profileName} (${member.name})`}</div>
            <div className='userEmail'>{member.email}</div>
          </div>

          <div className='userControl'>
            <select onChange={e => this.handleMemberRoleChange(member.name)(e)} disabled={isCurrentUser} value={member._pivot_role} className='userRole'>
              <option value='owner'>Owner</option>
              <option value='member'>Member</option>
            </select>
            <button onClick={e => this.handleMemberDeleteButtonClick(member.name)(e)} disabled={isCurrentUser}><i className='fa fa-times fa-fw'/></button>
          </div>
        </li>
      )
    })

    return (
      <div className='selectTab'>
        <div className='title'>Select member</div>
        <div className='memberForm'>
          <Select
            className='memberName'
            autoload={false}
            asyncOptions={getUsers}
            onChange={val => this.handleNewMemberChange(val)}
            value={selectState.newMember}
          />
        <button onClick={e => this.handleClickAddMemberButton(e)} className='addMemberBtn'>add</button>
        </div>
        <ul className='memberList'>
          {membersEl}
        </ul>
        <button onClick={e => this.props.close(e)}className='confirmBtn'>Done</button>
      </div>
    )
  }

  render () {
    let currentTab = this.state.currentTab === 'create'
      ? this.renderCreateTab()
      : this.renderSelectTab()

    return (
      <div className='CreateNewTeam modal'>
        <button onClick={e => this.handleCloseClick(e)} className='closeBtn'><i className='fa fa-fw fa-times'/></button>

        {currentTab}

        <div className='tabNav'>
          <i className={'fa fa-circle fa-fw' + (this.state.currentTab === 'create' ? ' active' : '')}/>
          <i className={'fa fa-circle fa-fw' + (this.state.currentTab === 'select' ? ' active' : '')}/>
        </div>
      </div>
    )
  }
}

CreateNewTeam.propTypes = {
  close: PropTypes.func
}
CreateNewTeam.prototype.linkState = linkState
