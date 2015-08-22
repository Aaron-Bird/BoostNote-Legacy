/* global localStorage */

var React = require('react/addons')

var Hq = require('../Services/Hq')

var LinkedState = require('../Mixins/LinkedState')
var KeyCaster = require('../Mixins/KeyCaster')

var UserStore = require('../Stores/UserStore')

module.exports = React.createClass({
  mixins: [LinkedState, KeyCaster('editProfileModal')],
  propTypes: {
    user: React.PropTypes.shape({
      name: React.PropTypes.string,
      profileName: React.PropTypes.string,
      email: React.PropTypes.string
    }),
    close: React.PropTypes.func
  },
  getInitialState: function () {
    var user = this.props.user
    return {
      currentTab: 'userInfo',
      user: {
        profileName: user.profileName,
        email: user.email
      },
      userSubmitStatus: null,
      password: {
        currentPassword: '',
        newPassword: '',
        passwordConfirmation: ''
      },
      passwordSubmitStatus: null
    }
  },
  onKeyCast: function (e) {
    switch (e.status) {
      case 'closeModal':
        this.props.close()
        break
    }
  },
  selectTab: function (tabName) {
    return function () {
      this.setState({currentTab: tabName})
    }.bind(this)
  },
  saveUserInfo: function () {
    this.setState({
      userSubmitStatus: 'sending'
    }, function () {
      Hq.updateUser(this.props.user.name, this.state.user)
        .then(function (res) {
          this.setState({userSubmitStatus: 'done'}, function () {
            localStorage.setItem('currentUser', JSON.stringify(res.body))
            UserStore.Actions.update(res.body)
          })
        }.bind(this))
        .catch(function (err) {
          console.error(err)
          this.setState({userSubmitStatus: 'error'})
        }.bind(this))
    })
  },
  savePassword: function () {
    this.setState({
      passwordSubmitStatus: 'sending'
    }, function () {
      console.log(this.state.password)
      Hq.changePassword(this.state.password)
        .then(function (res) {
          this.setState({
            passwordSubmitStatus: 'done',
            currentPassword: '',
            newPassword: '',
            passwordConfirmation: ''
          })
        }.bind(this))
        .catch(function (err) {
          console.error(err)
          this.setState({
            passwordSubmitStatus: 'error',
            currentPassword: '',
            newPassword: '',
            passwordConfirmation: ''
          })
        }.bind(this))
    })
  },
  render: function () {
    var content

    switch (this.state.currentTab) {
      case 'userInfo':
        content = this.renderUserInfoTab()
        break
      case 'password':
        content = this.renderPasswordTab()
        break
    }

    return (
      <div className='EditProfileModal modal tabModal'>
        <div className='leftPane'>
          <div className='tabLabel'>Edit profile</div>
          <div className='tabList'>
            <button className={this.state.currentTab === 'userInfo' ? 'active' : ''} onClick={this.selectTab('userInfo')}><i className='fa fa-user fa-fw'/> User Info</button>
            <button className={this.state.currentTab === 'password' ? 'active' : ''} onClick={this.selectTab('password')}><i className='fa fa-lock fa-fw'/> Password</button>
          </div>
        </div>
        <div className='rightPane'>
          {content}
        </div>
      </div>
    )
  },
  renderUserInfoTab: function () {
    return (
      <div className='userInfoTab'>
        <div className='formField'>
          <label>Profile Name</label>
          <input valueLink={this.linkState('user.profileName')}/>
        </div>
        <div className='formField'>
          <label>E-mail</label>
          <input valueLink={this.linkState('user.email')}/>
        </div>
        <div className='formConfirm'>
          <button disabled={this.state.userSubmitStatus === 'sending'} onClick={this.saveUserInfo}>Save</button>

          <div className={'alertInfo' + (this.state.userSubmitStatus === 'sending' ? '' : ' hide')}>on Sending...</div>

          <div className={'alertError' + (this.state.userSubmitStatus === 'error' ? '' : ' hide')}>Connection failed.. Try again.</div>

          <div className={'alertSuccess' + (this.state.userSubmitStatus === 'done' ? '' : ' hide')}>Successfully done!!</div>
        </div>
      </div>
    )
  },
  renderPasswordTab: function () {
    return (
      <div className='passwordTab'>
        <div className='formField'>
          <label>Current password</label>
          <input valueLink={this.linkState('password.currentPassword')}/>
        </div>
        <div className='formField'>
          <label>New password</label>
          <input valueLink={this.linkState('password.newPassword')}/>
        </div>
        <div className='formField'>
          <label>Confirmation</label>
          <input valueLink={this.linkState('password.passwordConfirmation')}/>
        </div>

        <div className='formConfirm'>
          <button disabled={this.state.password.newPassword.length === 0 || this.state.password.newPassword !== this.state.password.passwordConfirmation || this.state.passwordSubmitStatus === 'sending'} onClick={this.savePassword}>Save</button>

          <div className={'alertInfo' + (this.state.passwordSubmitStatus === 'sending' ? '' : ' hide')}>on Sending...</div>

          <div className={'alertError' + (this.state.passwordSubmitStatus === 'error' ? '' : ' hide')}>Connection failed.. Try again.</div>

          <div className={'alertSuccess' + (this.state.passwordSubmitStatus === 'done' ? '' : ' hide')}>Successfully done!!</div>
        </div>
      </div>
    )
  }
})
