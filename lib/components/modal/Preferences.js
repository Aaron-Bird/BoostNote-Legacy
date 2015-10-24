import React, { PropTypes } from 'react'
import { connect, Provider } from 'react-redux'
import linkState from 'boost/linkState'
import api from 'boost/api'
import store from 'boost/store'
import AppSettingTab from './Preference/AppSettingTab'
import HelpTab from './Preference/HelpTab'
import TeamSettingTab from './Preference/TeamSettingTab'
import MemberSettingTab from './Preference/MemberSettingTab'
import FolderSettingTab from './Preference/FolderSettingTab'
import { closeModal } from 'boost/modal'

var { findDOMNode } = require('react-dom')

const PROFILE = 'PROFILE'
const APP = 'APP'
const HELP = 'HELP'
const TEAM = 'TEAM'
const MEMBER = 'MEMBER'
const FOLDER = 'FOLDER'

class Preferences extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      currentTab: PROFILE,
      currentTeamId: props.status.userId,
      profile: {
        userInfo: {
          profileName: props.currentUser.profileName,
          email: props.currentUser.email,
          alert: null
        },
        password: {
          currentPassword: '',
          newPassword: '',
          confirmation: '',
          error: null
        }
      }
    }
  }

  switchTeam (teamId) {
    this.setState({currentTeamId: teamId})
  }

  handleNavButtonClick (tab) {
    return e => {
      this.setState({currentTab: tab})
    }
  }

  render () {
    let content = this.renderContent()

    let tabs = [
      {target: PROFILE, label: 'Profile'},
      {target: APP, label: 'Preferences'},
      {target: HELP, label: 'Help & Feedback'},
      {target: TEAM, label: 'Team setting'},
      {target: MEMBER, label: 'Manage member'},
      {target: FOLDER, label: 'Manage folder'}
    ]

    let navButtons = tabs.map(tab => (
      <button key={tab.target} onClick={e => this.handleNavButtonClick(tab.target)(e)} className={this.state.currentTab === tab.target ? 'active' : ''}>{tab.label}</button>
    ))

    return (
      <div className='Preferences modal'>
        <div className='header'>
          <div className='title'>Setting</div>
          <button onClick={e => closeModal()} className='closeBtn'>Done</button>
        </div>

        <div className='nav'>
          {navButtons}
        </div>

        {content}
      </div>
    )
  }

  renderContent () {
    let currentTeamId = parseInt(this.state.currentTeamId, 10)
    let teams = [this.props.currentUser].concat(this.props.currentUser.Teams)

    switch (this.state.currentTab) {
      case APP:
        return (<AppSettingTab/>)
      case HELP:
        return (<HelpTab/>)
      case TEAM:
        return (
          <TeamSettingTab
            currentTeamId={currentTeamId}
            teams={teams}
            switchTeam={teamId => this.switchTeam(teamId)}
          />
        )
      case MEMBER:
        return (
          <MemberSettingTab
            currentUser={this.props.currentUser}
            currentTeamId={currentTeamId}
            teams={teams}
            switchTeam={teamId => this.switchTeam(teamId)}
          />
        )
      case FOLDER:
        return (
          <FolderSettingTab
            currentTeamId={currentTeamId}
            teams={teams}
            switchTeam={teamId => this.switchTeam(teamId)}
          />
        )
      case PROFILE:
      default:
        return this.renderProfile()
    }
  }

  handleProfileSaveButtonClick (e) {
    let profileState = this.state.profile
    profileState.userInfo.alert = {
      type: 'info',
      message: 'Sending...'
    }
    this.setState({profile: profileState}, () => {
      let input = {
        profileName: profileState.userInfo.profileName,
        email: profileState.userInfo.email
      }
      api.updateUserInfo(input)
        .then(res => {
          let profileState = this.state.profile
          profileState.userInfo.alert = {
            type: 'success',
            message: 'Successfully done!'
          }
          this.setState({profile: profileState})
        })
        .catch(err => {
          var message
          if (err.status != null) {
            message = err.response.body.message
          } else if (err.code === 'ECONNREFUSED') {
            message = 'Can\'t connect to API server.'
          } else throw err

          let profileState = this.state.profile
          profileState.userInfo.alert = {
            type: 'error',
            message: message
          }

          this.setState({profile: profileState})
        })
    })
  }

  handlePasswordSaveButton (e) {
    let profileState = this.state.profile

    if (profileState.password.newPassword !== profileState.password.confirmation) {
      profileState.password.alert = {
        type: 'error',
        message: 'Confirmation doesn\'t match'
      }
      this.setState({profile: profileState})
      return
    }

    profileState.password.alert = {
      type: 'info',
      message: 'Sending...'
    }

    this.setState({profile: profileState}, () => {
      let input = {
        password: profileState.password.currentPassword,
        newPassword: profileState.password.newPassword
      }
      api.updatePassword(input)
        .then(res => {
          let profileState = this.state.profile
          profileState.password.alert = {
            type: 'success',
            message: 'Successfully done!'
          }
          profileState.password.currentPassword = ''
          profileState.password.newPassword = ''
          profileState.password.confirmation = ''

          this.setState({profile: profileState})
        })
        .catch(err => {
          var message
          if (err.status != null) {
            message = err.response.body.message
          } else if (err.code === 'ECONNREFUSED') {
            message = 'Can\'t connect to API server.'
          } else throw err

          let profileState = this.state.profile
          profileState.password.alert = {
            type: 'error',
            message: message
          }
          profileState.password.currentPassword = ''
          profileState.password.newPassword = ''
          profileState.password.confirmation = ''

          this.setState({profile: profileState}, () => {
            if (this.refs.currentPassword != null) findDOMNode(this.refs.currentPassword).focus()
          })
        })
    })
  }

  renderProfile () {
    let profileState = this.state.profile
    return (
      <div className='content profile'>
        <div className='section userSection'>
          <div className='sectionTitle'>User Info</div>
          <div className='sectionInput'>
            <label>Profile Name</label>
            <input valueLink={this.linkState('profile.userInfo.profileName')} type='text'/>
          </div>
          <div className='sectionInput'>
            <label>E-mail</label>
            <input valueLink={this.linkState('profile.userInfo.email')} type='text'/>
          </div>
          <div className='sectionConfirm'>
            <button onClick={e => this.handleProfileSaveButtonClick(e)}>Save</button>

            {this.state.profile.userInfo.alert != null
              ? (
                <div className={'alert ' + profileState.userInfo.alert.type}>{profileState.userInfo.alert.message}</div>
              )
              : null}
          </div>
        </div>

        <div className='section passwordSection'>
          <div className='sectionTitle'>Password</div>
          <div className='sectionInput'>
            <label>Current Password</label>
            <input ref='currentPassword' valueLink={this.linkState('profile.password.currentPassword')} type='password' placeholder='Current Password'/>
          </div>
          <div className='sectionInput'>
            <label>New Password</label>
            <input valueLink={this.linkState('profile.password.newPassword')} type='password' placeholder='New Password'/>
          </div>
          <div className='sectionInput'>
            <label>Confirmation</label>
            <input valueLink={this.linkState('profile.password.confirmation')} type='password' placeholder='Confirmation'/>
          </div>
          <div className='sectionConfirm'>
            <button onClick={e => this.handlePasswordSaveButton(e)}>Save</button>

            {profileState.password.alert != null
              ? (
                <div className={'alert ' + profileState.password.alert.type}>{profileState.password.alert.message}</div>
              )
              : null}
          </div>
        </div>
      </div>
    )
  }

}

Preferences.propTypes = {
  currentUser: PropTypes.shape(),
  close: PropTypes.func
}

Preferences.prototype.linkState = linkState

function remap (state) {
  let currentUser = state.currentUser
  let status = state.status

  return {
    currentUser,
    status
  }
}

let RootComponent = connect(remap)(Preferences)
export default class PreferencesModal extends React.Component {
  render () {
    return (
      <Provider store={store}>
        <RootComponent/>
      </Provider>
    )
  }
}
