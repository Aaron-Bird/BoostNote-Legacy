import React, { PropTypes } from 'react'
import { connect, Provider } from 'react-redux'
import auth from 'boost/auth'
import linkState from 'boost/linkState'
import Select from 'react-select'
import api from 'boost/api'
import ProfileImage from 'boost/components/ProfileImage'
import store from 'boost/store'
var { findDOMNode } = require('react-dom')

const PROFILE = 'PROFILE'
const PREFERENCES = 'PREFERENCES'
const HELP = 'HELP'
const TEAM = 'TEAM'
const MEMBER = 'MEMBER'
const FOLDER = 'FOLDER'

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

class Preferences extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      currentTab: PROFILE,
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

  handleNavButtonClick (tab) {
    return e => {
      this.setState({currentTab: tab})
    }
  }

  render () {
    let content = this.renderContent()

    let tabs = [
      {target: PROFILE, label: 'Profile'},
      {target: PREFERENCES, label: 'Preferences'},
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
          <button onClick={e => this.props.close()} className='closeBtn'>Done</button>
        </div>

        <div className='nav'>
          {navButtons}
        </div>

        {content}
      </div>
    )
  }

  renderContent () {
    switch (this.state.currentTab) {
      case PREFERENCES:
        return this.renderPreferences()
      case HELP:
        return this.renderHelp()
      case TEAM:
        return this.renderTeamSetting()
      case MEMBER:
        return this.renderMemberSetting()
      case FOLDER:
        return this.renderFolderSetting()
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

            {this.state.profile.password.alert != null
              ? (
                <div className={'alert ' + profileState.password.alert.type}>{profileState.password.alert.message}</div>
              )
              : null}
          </div>
        </div>
      </div>
    )
  }

  renderPreferences () {
    return (
      <div className='content preferences'>
        <div className='section passwordSection'>
          <div className='sectionTitle'>Hotkey</div>
          <div className='sectionInput'>
            <label>Toggle Finder(popup)</label>
            <input type='text'/>
          </div>
          <div className='sectionConfirm'>
            <button>Save</button>
          </div>
          <div className='description'>
            <ul>
              <li><code>0</code> to <code>9</code></li>
              <li><code>A</code> to <code>Z</code></li>
              <li><code>F1</code> to <code>F24</code></li>
              <li>Punctuations like <code>~</code>, <code>!</code>, <code>@</code>, <code>#</code>, <code>$</code>, etc.</li>
              <li><code>Plus</code></li>
              <li><code>Space</code></li>
              <li><code>Backspace</code></li>
              <li><code>Delete</code></li>
              <li><code>Insert</code></li>
              <li><code>Return</code> (or <code>Enter</code> as alias)</li>
              <li><code>Up</code>, <code>Down</code>, <code>Left</code> and <code>Right</code></li>
              <li><code>Home</code> and <code>End</code></li>
              <li><code>PageUp</code> and <code>PageDown</code></li>
              <li><code>Escape</code> (or <code>Esc</code> for short)</li>
              <li><code>VolumeUp</code>, <code>VolumeDown</code> and <code>VolumeMute</code></li>
              <li><code>MediaNextTrack</code>, <code>MediaPreviousTrack</code>, <code>MediaStop</code> and <code>MediaPlayPause</code></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  renderHelp () {
    return (
      <div className='content help'>
        Comming soon
      </div>
    )
  }

  renderTeamSetting () {
    return (
      <div className='content teamSetting'>
        <div className='header'>
          <select>
            <option></option>
          </select>
          <div>'s Team Setting</div>
        </div>
        <div className='section'>
          <div className='sectionTitle'>Team profile</div>
          <div className='sectionInput'>
            <div className='label'>Team Name</div>
            <input type='text'/>
          </div>
          <div className='sectionConfirm'>
            <button>Save</button>
          </div>
        </div>

        {false
          ? (
            <div className='section teamDelete'>
              <div className='label'>Delete this team</div>
              <button>Delete</button>
            </div>
          )
          : (
            <div className='section teamDeleteConfirm'>
              <div>Are you sure to delete this team?</div>
              <button>Sure</button>
              <button>Cancel</button>
            </div>
          )}
      </div>
    )
  }

  renderMemberSetting () {
    let membersEl = [].map(member => {
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
      <div className='content memberSetting'>
        <div className='header'>
          <select>
            <option></option>
          </select>
          <div>'s Team Setting</div>
        </div>

        <div>
          <Select
            className='memberName'
            autoload={false}
            asyncOptions={getUsers}
            onChange={val => this.handleNewMemberChange(val)}
            value={null}
          />
          <button onClick={e => this.handleClickAddMemberButton(e)} className='addMemberBtn'>add</button>
        </div>
        <ul className='memberList'>
          {membersEl}
        </ul>
      </div>
    )
  }

  renderFolderSetting () {
    return (
      <div className='content folderSetting'></div>
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

  return {
    currentUser
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
