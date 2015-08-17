/* global localStorage */
var React = require('react/addons')
var ReactRouter = require('react-router')
var Navigation = ReactRouter.Navigation
var request = require('superagent')

var LinkedState = require('../Mixins/LinkedState')

var ProfileImage = require('./ProfileImage')

var apiUrl = require('../../../config').apiUrl

module.exports = React.createClass({
  mixins: [LinkedState, Navigation],
  propTypes: {
    close: React.PropTypes.func,
    currentUser: React.PropTypes.object
  },
  getInitialState: function () {
    return {
      currentTab: 'profile',
      profileName: this.props.currentUser.profileName,
      userName: this.props.currentUser.name,
      email: this.props.currentUser.email,
      currentPassword: '',
      newPassword: '',
      confirmation: '',
      contactTitle: '',
      contactContent: ''
    }
  },
  componentDidMount: function () {
  },
  componentWillUnmount: function () {
  },
  onListen: function (res) {
  },
  activeProfile: function () {
    this.setState({currentTab: 'profile'})
  },
  activeContact: function () {
    this.setState({currentTab: 'contact'})
  },
  activeInfo: function () {
    this.setState({currentTab: 'info'})
  },
  activeLogout: function () {
    this.setState({currentTab: 'logout'})
  },
  saveProfile: function () {
  },
  savePassword: function () {
    this.setState({
      isChangingPassword: true,
      isChangingPasswordDone: false,
      isChangingPasswordFailed: false
    })
    if (this.state.newPassword === this.state.confirmation) {
      request
        .put(apiUrl + 'auth/password')
        .set({
          Authorization: 'Bearer ' + localStorage.getItem('token')
        })
        .send({
          currentPassword: this.state.currentPassword,
          newPassword: this.state.newPassword
        })
        .end(function (err, res) {
          if (err) {
            console.error(err)
            this.setState({
              currentPassword: '',
              newPassword: '',
              confirmation: '',
              isChangingPassword: false,
              isChangingPasswordDone: false,
              isChangingPasswordFailed: true
            })
            return
          }

          this.setState({
            currentPassword: '',
            newPassword: '',
            confirmation: '',
            isChangingPassword: false,
            isChangingPasswordDone: true,
            isChangingPasswordFailed: false
          })

        }.bind(this))
    }
  },
  sendEmail: function () {
    this.setState({
      isSending: true,
      isSendingDone: false,
      isSendingFailed: false
    }, function () {
      request
        .post(apiUrl + 'mail')
        .set({
          Authorization: 'Bearer ' + localStorage.getItem('token')
        })
        .send({
          title: this.state.contactTitle,
          content: this.state.contactContent
        })
        .end(function (err, res) {
          if (err) {
            console.error(err)
            this.setState({
              isSending: false,
              isSendingDone: false,
              isSendingFailed: true
            })
            return
          }
          this.setState({
            isSending: false,
            isSendingDone: true,
            isSendingFailed: false,
            contactTitle: '',
            contactContent: ''
          })
        }.bind(this))
    })
  },
  logOut: function () {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token')
  },
  interceptClick: function (e) {
    e.stopPropagation()
  },
  render: function () {
    var content
    if (this.state.currentTab === 'profile') {
      content = (
        <div className='profile'>
          <div className='profileTop'>
            <div className='profileFormRow'>
              <label>Profile Name</label>
              <input valueLink={this.linkState('profileName')} className='block-input' type='text' placeholder='Name'/>
            </div>
            <div className='profileFormRow'>
              <label>Name</label>
              <input valueLink={this.linkState('userName')} className='block-input' type='text' placeholder='Name'/>
            </div>
            <div className='profileFormRow'>
              <label>E-mail</label>
              <input valueLink={this.linkState('email')} className='block-input' type='text' placeholder='E-mail'/>
            </div>
            <div className='profileFormRow'>
              <button onClick={this.saveProfile} className='saveButton btn-primary'>Save</button>
              <p className={'alertInfo' + (this.state.isUpdatingProfile ? '' : ' hide')}>Updating profile...</p>
              <p className={'alertSuccess' + (this.state.isUpdatingProfileDone ? '' : ' hide')}>Successfully updated</p>
              <p className={'alertError' + (this.state.isUpdatingProfileFailed ? '' : ' hide')}>An Error occurred</p>
            </div>
          </div>

          <div className='profileBottom'>
            <div className='profileFormRow'>
              <label>Current password</label>
              <input valueLink={this.linkState('currentPassword')} className='block-input' type='password' placeholder='Current password'/>
            </div>
            <div className='profileFormRow'>
              <label>New password</label>
              <input valueLink={this.linkState('newPassword')} className='block-input' type='password' placeholder='New password'/>
            </div>
            <div className='profileFormRow'>
              <label>Confirmation</label>
              <input valueLink={this.linkState('confirmation')} className='block-input' type='password' placeholder='Confirmation'/>
            </div>
            <div className='profileFormRow'>
              <button onClick={this.savePassword} className='saveButton btn-primary'>Save</button>
              <p className={'alertInfo' + (this.state.isChangingPassword ? '' : ' hide')}>Changing password...</p>
              <p className={'alertSuccess' + (this.state.isChangingPasswordDone ? '' : ' hide')}>Successfully changed</p>
              <p className={'alertError' + (this.state.isChangingPasswordFailed ? '' : ' hide')}>An Error occurred</p>
            </div>
          </div>
        </div>
      )
    } else if (this.state.currentTab === 'contact') {
      content = (
        <div className='contact'>
          <p>
            Let us know your opinion about CodeXen.<br/>
          Your feedback might be used to improvement of CodeXen.
          </p>
          <input valueLink={this.linkState('contactTitle')} className='block-input' type='text' placeholder='title'/>
          <textarea valueLink={this.linkState('contactContent')} className='block-input' placeholder='message content'/>
          <div className='contactFormRow'>
            <button disabled={this.state.isSending} onClick={this.sendEmail} className='saveButton btn-primary'>Send</button>
            <p className={'alertInfo' + (this.state.isSending ? '' : ' hide')}>Sending...</p>
            <p className={'alertSuccess' + (this.state.isSendingDone ? '' : ' hide')}>Successfully sent</p>
            <p className={'alertError' + (this.state.isSendingFailed ? '' : ' hide')}>An Error occurred</p>
          </div>
        </div>
      )
    } else if (this.state.currentTab === 'info') {
      content = (
        <div className='info'>
          <h2 className='infoLabel'>External links</h2>
          <ul className='externalList'>
            <li><a>CodeXen Homepage <i className='fa fa-external-link'/></a></li>
            <li><a>Regulation <i className='fa fa-external-link'/></a></li>
            <li><a>Private policy <i className='fa fa-external-link'/></a></li>
          </ul>
        </div>
      )
    } else {
      content = (
        <div className='logout'>
          <p className='logoutLabel'>Are you sure to logout?</p>

          <ProfileImage className='userPhoto' size='150' email={this.props.currentUser.email}/><br/>
          <button onClick={this.logOut} className='logoutButton btn-default'>Logout</button>
        </div>
      )
    }

    return (
      <div onClick={this.interceptClick} className='PersonalSettingModal modal'>
        <div className='settingNav'>
          <h1>Personal setting</h1>
          <nav>
            <button className={this.state.currentTab === 'profile' ? 'active' : ''} onClick={this.activeProfile}><i className='fa fa-user fa-fw'/> Profile</button>
            <button className={this.state.currentTab === 'contact' ? 'active' : ''} onClick={this.activeContact}><i className='fa fa-phone fa-fw'/> Contact</button>
            <button className={this.state.currentTab === 'info' ? 'active' : ''} onClick={this.activeInfo}><i className='fa fa-info-circle fa-fw'/> Info</button>
            <button className={this.state.currentTab === 'logout' ? 'active' : ''} onClick={this.activeLogout}><i className='fa fa-sign-out fa-fw'/> Logout</button>
          </nav>
        </div>
        <div className='settingBody'>
          {content}
        </div>
      </div>
    )
  }
})
