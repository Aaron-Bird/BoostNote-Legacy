import React, { PropTypes } from 'react'
import ProfileImage from '../../../components/ProfileImage'
import { createTeam } from '../api'
import linkState from '../../../helpers/linkState'

export default class CreateNewTeam extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      create: {
        name: '',
        alert: null
      },
      select: {
        team: {"name":"test123",
          "profileName":"test123",
          "userType":"team",
          "updatedAt":"2015-10-11T09:01:01.277Z",
          "createdAt":"2015-10-11T09:01:01.277Z",
          "id":220,"Members":[{"id":213,"email":"fluke8259@gmail.com","name":"rokt33r","profileName":"Rokt33r","userType":"person","createdAt":"2015-10-05T09:01:30.000Z","updatedAt":"2015-10-05T09:01:30.000Z","_pivot_TeamId":220,"_pivot_MemberId":213,"_pivot_role":"owner"}]
        },
        alert: null
      },
      currentTab: 'select'
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
      let errorMessage = err.response != null ? err.response.body.message : err.message

      let createState = this.state.create
      createState.isSending = false
      createState.alert = {
        type: 'error',
        message: 'Can\'t connect to API server.'
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

        <input valueLink={linkState(this, 'create.name')} className='ipt' type='text' placeholder='Enter your team name'/>
        {alertEl}
        <button onClick={e => this.handleContinueClick(e)} disabled={createState.isSending} className='confirmBtn'>Continue <i className='fa fa-arrow-right fa-fw'/></button>
      </div>
    )
  }

  renderSelectTab () {
    let selectState = this.state.select
    console.log(selectState)
    let membersEl = selectState.team.Members.map(member => {
      return (
        <li key={'user-' + member.id}>
          <ProfileImage className='userPhoto' email={member.email} size='30'/>
          <div className='userInfo'>
            <div className='userName'>{`${member.profileName} (${member.name})`}</div>
            <div className='userEmail'>{member.email}</div>
          </div>
          <div className='userControl'>
            <select value={member._pivot_role} className='userRole'>
              <option value='owner'>Owner</option>
              <option value='member'>Member</option>
            </select>
            <button><i className='fa fa-times fa-fw'/></button>
          </div>
        </li>
      )
    })

    return (
      <div className='selectTab'>
        <div className='title'>Select member</div>
        <div className='ipt'>
          <input type='text' placeholder='Enter user name or e-mail'/>
          <button>add</button>
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
