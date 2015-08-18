/* global localStorage */

var React = require('react/addons')

var Hq = require('../Services/Hq')

var LinkedState = require('../Mixins/LinkedState')

var UserStore = require('../Stores/UserStore')

module.exports = React.createClass({
  mixins: [LinkedState],
  propTypes: {
    team: React.PropTypes.shape({
      name: React.PropTypes.string,
      profileName: React.PropTypes.string,
      email: React.PropTypes.string
    })
  },
  getInitialState: function () {
    var team = this.props.team
    return {
      currentTab: 'teamInfo',
      team: {
        name: team.name,
        profileName: team.profileName
      },
      userSubmitStatus: null
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
      Hq.updateUser(this.props.team.name, this.state.team)
        .then(function (res) {
          this.setState({userSubmitStatus: 'done'}, function () {
            UserStore.Actions.update(res.body)
          })
        }.bind(this))
        .catch(function (err) {
          console.error(err)
          this.setState({userSubmitStatus: 'error'})
        }.bind(this))
    })
  },
  render: function () {
    var content

    switch (this.state.currentTab) {
      case 'teamInfo':
        content = this.renderTeamInfoTab()
        break
      case 'members':
        content = this.renderMembersTab()
        break
    }

    return (
      <div className='EditProfileModal modal tabModal'>
        <div className='leftPane'>
          <div className='tabLabel'>Team settings</div>
          <div className='tabList'>
            <button className={this.state.currentTab === 'teamInfo' ? 'active' : ''} onClick={this.selectTab('teamInfo')}><i className='fa fa-info-circle fa-fw'/> Team Info</button>
            <button className={this.state.currentTab === 'members' ? 'active' : ''} onClick={this.selectTab('members')}><i className='fa fa-users fa-fw'/> Members</button>
          </div>
        </div>
        <div className='rightPane'>
          {content}
        </div>
      </div>
    )
  },
  renderTeamInfoTab: function () {
    return (
      <div className='userInfoTab'>
        <div className='formField'>
          <label>Profile Name</label>
          <input valueLink={this.linkState('team.profileName')}/>
        </div>
        <div className='formField'>
          <label>Name</label>
          <input valueLink={this.linkState('team.name')}/>
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
  renderMembersTab: function () {
    return (
      <div className='membersTab'>
      </div>
    )
  }
})
